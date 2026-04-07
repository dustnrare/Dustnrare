// ═══════════════════════════════════════════════════════════════
// routes/products.js
// ═══════════════════════════════════════════════════════════════
const { Router }                      = require('express')
const { Product }                     = require('../models')
const { protect, sellerOnly, optionalAuth } = require('../middleware/auth')

const products = Router()

products.get('/', optionalAuth, async (req, res) => {
  try {
    const { category, sizes, fit, maxPrice, sort, page = 1, limit = 20 } = req.query
    const q = { isActive: true }
    if (category) q.category = { $in: category.split(',') }
    if (fit)      q.fit      = { $in: fit.split(',') }
    if (sizes)    q.sizes    = { $in: sizes.split(',') }
    if (maxPrice) q.price    = { $lte: Number(maxPrice) }

    const sortMap = { 'price-asc': { price:1 }, 'price-desc': { price:-1 }, newest: { createdAt:-1 }, featured: { soldCount:-1 } }
    const [items, total] = await Promise.all([
      Product.find(q).sort(sortMap[sort] || { createdAt:-1 }).skip((page-1)*limit).limit(+limit),
      Product.countDocuments(q),
    ])
    res.json({ products: items, total, page: +page, pages: Math.ceil(total/limit) })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

products.get('/search', async (req, res) => {
  try {
    const items = await Product.find({ isActive: true, $text: { $search: req.query.q || '' } }, { score:{ $meta:'textScore' } }).sort({ score:{ $meta:'textScore' } }).limit(20)
    res.json({ products: items })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

products.get('/:id', async (req, res) => {
  try {
    const p = await Product.findById(req.params.id)
    if (!p) return res.status(404).json({ message: 'Not found' })
    res.json(p)
  } catch (e) { res.status(500).json({ message: e.message }) }
})

products.post('/', protect, sellerOnly, async (req, res) => {
  try { res.status(201).json(await Product.create({ ...req.body, seller: req.user._id })) }
  catch (e) { res.status(400).json({ message: e.message }) }
})

products.put('/:id', protect, sellerOnly, async (req, res) => {
  try {
    const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!p) return res.status(404).json({ message: 'Not found' })
    res.json(p)
  } catch (e) { res.status(400).json({ message: e.message }) }
})

products.delete('/:id', protect, sellerOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { isActive: false })
    res.json({ message: 'Product removed' })
  } catch (e) { res.status(500).json({ message: e.message }) }
})

module.exports =  products 
