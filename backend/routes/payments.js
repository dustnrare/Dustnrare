// routes/payments.js
const { Router }  = require('express')
const crypto      = require('crypto')
const Razorpay    = require('razorpay')
const Stripe      = require('stripe')
const { Order, User } = require('../models')
const { protect: verifyToken } = require('../middleware/auth')

const router = Router()

// Lazy init — only fails at runtime if keys not set
function getRazorpay() {
  return new Razorpay({
    key_id:     process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-04-10' })
}

// ── POST /api/payments/razorpay/create-order ─────────────────
router.post('/razorpay/create-order', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body  // ₹ rupees
    if (!amount || amount < 1) return res.status(400).json({ message: 'Invalid amount' })

    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
      amount:   Math.round(amount * 100),  // paise
      currency: 'INR',
      receipt:  `dnr_${Date.now()}`,
    })

    res.json({ orderId: order.id, amount: order.amount, currency: 'INR' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/payments/razorpay/verify ───────────────────────
router.post('/razorpay/verify', verifyToken, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,    // our MongoDB Order _id
    } = req.body

    // Verify HMAC signature
    const body     = `${razorpay_order_id}|${razorpay_payment_id}`
    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed — signature mismatch' })
    }

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' })
    }

    const order = await Order.findById(orderId)
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    // Verify amount matches exactly to prevent price manipulation
    const razorpay = getRazorpay()
    const payment = await razorpay.payments.fetch(razorpay_payment_id)
    if (payment.amount !== Math.round(order.total * 100)) {
       return res.status(400).json({ message: 'Payment verification failed — amount mismatch' })
    }

    // Update order in DB
    await Order.findByIdAndUpdate(orderId, {
      $set: {
        'payment.status':             'paid',
        'payment.razorpayOrderId':    razorpay_order_id,
        'payment.razorpayPaymentId':  razorpay_payment_id,
        'payment.razorpaySignature':  razorpay_signature,
        status: 'confirmed',
      },
    })

    res.json({ verified: true, paymentId: razorpay_payment_id })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/payments/stripe/create-intent ──────────────────
router.post('/stripe/create-intent', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body  // ₹ rupees
    const stripe = getStripe()
    const intent = await stripe.paymentIntents.create({
      amount:   Math.round(amount * 100),
      currency: 'inr',
      metadata: { uid: req.firebaseUser.uid },
    })
    res.json({ clientSecret: intent.client_secret })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/payments/stripe/webhook ───────────────────────
// Raw body is set in server.js for this path
router.post('/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event
  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ message: `Webhook error: ${err.message}` })
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object
    await Order.findOneAndUpdate(
      { 'payment.stripePaymentIntent': intent.id },
      { $set: { 'payment.status': 'paid', status: 'confirmed' } }
    )
  }

  if (event.type === 'payment_intent.payment_failed') {
    const intent = event.data.object
    await Order.findOneAndUpdate(
      { 'payment.stripePaymentIntent': intent.id },
      { $set: { 'payment.status': 'failed' } }
    )
  }

  res.json({ received: true })
})

// ── POST /api/payments/cod ───────────────────────────────────
router.post('/cod', verifyToken, async (req, res) => {
  try {
    const { orderId } = req.body
    
    const dbUser = await User.findOne({ uid: req.firebaseUser.uid })
    if (!dbUser) return res.status(404).json({ message: 'User not found' })

    const order = await Order.findOneAndUpdate(
      { _id: orderId, customer: dbUser._id },
      { $set: { 'payment.method': 'cod', 'payment.status': 'pending', status: 'confirmed' } },
      { new: true }
    )
    if (!order) return res.status(404).json({ message: 'Order not found or unauthorized' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
