const admin    = require('../config/firebase')
const { User } = require('../models')

async function protect(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' })
  try {
    const decoded = await admin.auth().verifyIdToken(header.split(' ')[1])
    req.firebaseUser = decoded
    req.user = await User.findOneAndUpdate(
      { uid: decoded.uid },
      { $setOnInsert: { uid: decoded.uid, email: decoded.email, phone: decoded.phone_number } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    next()
  } catch { res.status(401).json({ message: 'Invalid token' }) }
}

function sellerOnly(req, res, next) {
  if (!['seller', 'admin'].includes(req.user?.role))
    return res.status(403).json({ message: 'Seller access required' })
  next()
}

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return next()
  try {
    const decoded = await admin.auth().verifyIdToken(header.split(' ')[1])
    req.user = await User.findOne({ uid: decoded.uid })
  } catch {}
  next()
}

module.exports = { protect, sellerOnly, optionalAuth }
