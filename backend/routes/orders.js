const { Router } = require('express')
const { Order, Product, User } = require('../models')
const { protect, sellerOnly } = require('../middleware/auth')

const router = Router()

// ── POST /api/orders ─────────────────────────────────────────
// Creates order in DB + returns WhatsApp & email links
router.post('/', protect, async (req, res) => {
  try {
    const { items, address, paymentMethod = 'whatsapp' } = req.body

    if (!items?.length) return res.status(400).json({ message: 'Cart is empty' })
    if (!address) return res.status(400).json({ message: 'Delivery address required' })

    let subtotal = 0
    const orderItems = []

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` })
      if (product.stock < item.qty) return res.status(400).json({ message: `${product.name} — not enough stock` })

      subtotal += product.price * item.qty
      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0],
        size: item.size,
        qty: item.qty,
        price: product.price,
      })
    }

    const shipping = subtotal >= 999 ? 0 : 60
    const total = subtotal + shipping

    const dbUser = await User.findOne({ uid: req.firebaseUser.uid })

    const order = await Order.create({
      customer: dbUser?._id,
      items: orderItems,
      subtotal,
      shipping,
      total,
      address,
      payment: { method: paymentMethod, status: 'pending' },
      status: 'placed',
    })

    // ── Build WhatsApp message ──────────────────────────────
    const itemLines = orderItems
      .map(i => `• ${i.name} × ${i.qty} (Size: ${i.size}) — ₹${(i.price * i.qty).toLocaleString('en-IN')}`)
      .join('\n')

    const waText = encodeURIComponent(
      `🛍️ New Order — Dust N Rare
Order ID: ${order.orderId}

Items:
${itemLines}

Subtotal: ₹${subtotal.toLocaleString('en-IN')}
Shipping: ${shipping === 0 ? 'Free' : '₹' + shipping}
*Total: ₹${total.toLocaleString('en-IN')}*

Delivery to:
${address.name}
${address.line1}${address.line2 ? ', ' + address.line2 : ''}
${address.city}, ${address.state} — ${address.pincode}
Phone: ${address.phone}

Payment: Will pay via UPI/bank transfer`)

    const waNumber = process.env.ORDER_WHATSAPP || '918789277058'
    const waLink = `https://wa.me/${waNumber}?text=${waText}`

    // ── Build Email mailto link ─────────────────────────────
    const emailSubject = encodeURIComponent(`New Order ${order.orderId} — Dust N Rare`)
    const emailBody = encodeURIComponent(
      `New Order Received — Dust N Rare

Order ID: ${order.orderId}

ITEMS:
${orderItems.map(i => `${i.name} x${i.qty} (Size: ${i.size}) — Rs.${i.price * i.qty}`).join('\n')}

Subtotal: Rs.${subtotal}
Shipping: ${shipping === 0 ? 'Free' : 'Rs.' + shipping}
Total: Rs.${total}

DELIVERY ADDRESS:
${address.name}
${address.line1}${address.line2 ? ', ' + address.line2 : ''}
${address.city}, ${address.state} - ${address.pincode}
Phone: ${address.phone}

Payment: Pending (UPI/bank transfer)`)

    const orderEmail = process.env.ORDER_EMAIL || 'dustnrare@gmail.com'
    const emailLink = `mailto:${orderEmail}?subject=${emailSubject}&body=${emailBody}`

    res.status(201).json({ order, waLink, emailLink })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/orders/me ───────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const dbUser = await User.findOne({ uid: req.firebaseUser.uid })
    const orders = await Order
      .find({ customer: dbUser?._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name images price')
    res.json({ orders })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/orders (seller) ─────────────────────────────────
router.get('/', protect, sellerOnly, async (req, res) => {
  try {
    const { status, page = 1, limit = 30 } = req.query
    const filter = status && status !== 'all' ? { status } : {}
    const orders = await Order
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('customer', 'name email phone')
    const total = await Order.countDocuments(filter)
    const revenue = await Order.aggregate([
      { $match: { status: { $in: ['confirmed', 'shipped', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ])
    res.json({ orders, total, revenue: revenue[0]?.total || 0 })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/orders/:id ──────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const dbUser = await User.findOne({ uid: req.firebaseUser.uid })
    const order = await Order.findById(req.params.id).populate('items.product')

    if (!order) return res.status(404).json({ message: 'Order not found' })

    // IDOR protection: ensure order belongs to the requester or requester is seller/admin
    if (!dbUser || (!['seller', 'admin'].includes(dbUser.role) && !order.customer.equals(dbUser._id))) {
      return res.status(403).json({ message: 'Unauthorized to view this order' })
    }

    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── PUT /api/orders/:id/status (seller) ──────────────────────
router.put('/:id/status', protect, sellerOnly, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body
    const update = { status }
    if (trackingNumber) update.trackingNumber = trackingNumber
    const order = await Order.findByIdAndUpdate(req.params.id, { $set: update }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json({ order })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router