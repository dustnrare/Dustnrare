const mongoose = require('mongoose')

// ── USER ────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema({
  uid:         { type: String, required: true, unique: true },  // Firebase UID
  email:       { type: String, sparse: true },
  phone:       { type: String, sparse: true },
  name:        { type: String, default: '' },
  role:        { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  addresses:   [{
    label:    String,
    line1:    String,
    line2:    String,
    city:     String,
    state:    String,
    pincode:  String,
    isDefault:Boolean,
  }],
  wishlist:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true })

// ── PRODUCT ─────────────────────────────────────────────────
const ProductSchema = new mongoose.Schema({
  name:          { type: String, required: true, trim: true },
  category:      { type: String, enum: ['men', 'women', 'surplus'], required: true },
  fit:           { type: String, enum: ['oversized', 'regular', 'slim'], default: 'regular' },
  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  badge:         { type: String, default: '' },
  sizes:         [{ type: String }],
  stock:         { type: Number, required: true, default: 0 },
  images:        [{ type: String }],
  description:   { type: String, default: '' },
  fabric:        { type: String, default: '' },
  isActive:      { type: Boolean, default: true },
  seller:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  soldCount:     { type: Number, default: 0 },
}, { timestamps: true })

ProductSchema.index({ category: 1, isActive: 1 })
ProductSchema.index({ name: 'text', description: 'text' })

// ── ORDER ────────────────────────────────────────────────────
const OrderItemSchema = new mongoose.Schema({
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name:      String,
  image:     String,
  size:      String,
  qty:       { type: Number, required: true, min: 1 },
  price:     { type: Number, required: true },
}, { _id: false })

const OrderSchema = new mongoose.Schema({
  orderId:   { type: String, unique: true },           // e.g. DNR-0086
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items:     [OrderItemSchema],
  subtotal:  { type: Number, required: true },
  shipping:  { type: Number, default: 0 },
  total:     { type: Number, required: true },
  address: {
    name:    String, phone: String,
    line1:   String, line2: String,
    city:    String, state: String, pincode: String,
  },
  payment: {
    method:    { type: String, enum: ['razorpay', 'stripe', 'cod'], required: true },
    status:    { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    razorpayOrderId:    String,
    razorpayPaymentId:  String,
    razorpaySignature:  String,
    stripePaymentIntent:String,
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'placed',
  },
  trackingNumber: String,
  notes:    String,
}, { timestamps: true })

// Auto-generate orderId before save
OrderSchema.pre('save', async function(next) {
  if (!this.orderId) {
    const count = await mongoose.model('Order').countDocuments()
    this.orderId = `DNR-${String(count + 1).padStart(4, '0')}`
  }
  next()
})

// ── COUPON ───────────────────────────────────────────────────
const CouponSchema = new mongoose.Schema({
  code:          { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType:  { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true, min: 0 },
  isActive:      { type: Boolean, default: true },
  usageCount:    { type: Number, default: 0 },
}, { timestamps: true })

// ── TESTIMONIAL ─────────────────────────────────────────────
const TestimonialSchema = new mongoose.Schema({
  stars:    { type: Number, required: true, min: 1, max: 5 },
  text:     { type: String, required: true },
  author:   { type: String, required: true },
  location: { type: String, required: true },
  product:  { type: String, required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

module.exports = {
  User:        mongoose.model('User',        UserSchema),
  Product:     mongoose.model('Product',     ProductSchema),
  Order:       mongoose.model('Order',       OrderSchema),
  Coupon:      mongoose.model('Coupon',      CouponSchema),
  Testimonial: mongoose.model('Testimonial', TestimonialSchema),
}
