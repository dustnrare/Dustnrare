// routes/auth.js
const { Router }  = require('express')
const { User }    = require('../models')
const { protect: verifyToken, sellerOnly: requireSeller } = require('../middleware/auth')
const admin = require('../config/firebase')

const router = Router()

// ── POST /api/auth/sync ──────────────────────────────────────
// Called from frontend after any Firebase sign-in
router.post('/sync', verifyToken, async (req, res) => {
  try {
    const { uid, email, phone_number, name, picture } = req.firebaseUser
    const body = req.body || {}

    const user = await User.findOneAndUpdate(
      { uid },
      {
        $set: {
          uid,
          email:  body.email  || email        || undefined,
          phone:  body.phone  || phone_number || undefined,
          name:   body.name   || name         || '',
        },
        $setOnInsert: { role: 'customer' },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────
router.get('/me', verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.firebaseUser.uid })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── PUT /api/auth/me ─────────────────────────────────────────
router.put('/me', verifyToken, async (req, res) => {
  try {
    const allowed = ['name', 'addresses']
    const update  = {}
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k] })

    const user = await User.findOneAndUpdate(
      { uid: req.firebaseUser.uid },
      { $set: update },
      { new: true }
    )
    res.json({ user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})


// ── POST /api/auth/grant-seller ──────────────────────────────
// Admin only — grants seller Firebase custom claim + DB role
router.post('/grant-seller', verifyToken, async (req, res) => {
  try {
    const adminUIDs = (process.env.ADMIN_UIDS || '').split(',').map(s => s.trim())
    if (!adminUIDs.includes(req.firebaseUser.uid)) {
      return res.status(403).json({ message: 'Admin access required' })
    }

    const { targetUid } = req.body
    if (!targetUid) return res.status(400).json({ message: 'targetUid required' })

    // Set Firebase custom claim
    await admin.auth().setCustomUserClaims(targetUid, { role: 'seller' })

    // Update MongoDB role
    await User.findOneAndUpdate({ uid: targetUid }, { $set: { role: 'seller' } })

    res.json({ message: `Seller role granted to ${targetUid}` })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── POST /api/auth/wishlist/toggle ───────────────────────────
router.post('/wishlist/toggle', verifyToken, async (req, res) => {
  try {
    const { productId } = req.body
    const user = await User.findOne({ uid: req.firebaseUser.uid })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const idx = user.wishlist.indexOf(productId)
    if (idx === -1) user.wishlist.push(productId)
    else            user.wishlist.splice(idx, 1)

    await user.save()
    res.json({ wishlist: user.wishlist })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
