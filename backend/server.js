require('dotenv').config()
const express   = require('express')
const cors      = require('cors')
const helmet    = require('helmet')
const morgan    = require('morgan')
const rateLimit = require('express-rate-limit')
const connectDB = require('./config/db')

const app = express()
connectDB()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }))
app.use(morgan('dev'))
// Stripe webhook needs raw body — before express.json
app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }))

app.use('/api/auth',     require('./routes/auth'))
app.use('/api/products', require('./routes/products'))
app.use('/api/orders',   require('./routes/orders'))
app.use('/api/upload',   require('./routes/upload'))

app.get('/health', (_, res) => res.json({ status: 'ok', brand: 'DUST·N·RARE' }))
app.use((_, res) => res.status(404).json({ message: 'Not found' }))
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`\n🔥  DUST·N·RARE API → http://localhost:${PORT}\n`))
