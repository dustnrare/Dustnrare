const { Router } = require('express')
const multer     = require('multer')
const cloudinary = require('../config/cloudinary')
const { protect, sellerOnly } = require('../middleware/auth')

const router  = Router()

// Store file in memory buffer (not disk)
const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 5 * 1024 * 1024 },  // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true)
    else cb(new Error('Only image files allowed'))
  },
})

// ── POST /api/upload/product ─────────────────────────────────
// Upload 1–5 product images, returns array of URLs
router.post('/product', protect, sellerOnly, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: 'No images provided' })
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder:         'dustnrare/products',
            transformation: [
              { width: 800, height: 1067, crop: 'fill', gravity: 'auto' },
              { quality: 'auto:good', fetch_format: 'auto' },
            ],
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result.secure_url)
          }
        )
        stream.end(file.buffer)
      })
    })

    const urls = await Promise.all(uploadPromises)
    res.json({ urls })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// ── DELETE /api/upload/product ───────────────────────────────
// Delete image from Cloudinary by URL
router.delete('/product', protect, sellerOnly, async (req, res) => {
  try {
    const { url } = req.body
    if (!url) return res.status(400).json({ message: 'URL required' })

    // Extract public_id from URL
    // e.g. https://res.cloudinary.com/mycloud/image/upload/v123/dustnrare/products/abc.jpg
    const parts   = url.split('/')
    const filename = parts[parts.length - 1].split('.')[0]
    const publicId = `dustnrare/products/${filename}`

    await cloudinary.uploader.destroy(publicId)
    res.json({ message: 'Image deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router