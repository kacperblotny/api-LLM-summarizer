const express = require('express')
const app = express()

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')

const PORT = process.env.PORT || 8080

// set security headers
app.use(helmet())

// prevent xss attacks
app.use(xss())

// rate limiting, 100 requests per 5min per ip
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 100,
})
app.use(limiter)

app.use('/summarize', require('./routes/summarize'))

app.get('/', (req, res) => {
  res.send(`api running on port ${PORT}`)
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
