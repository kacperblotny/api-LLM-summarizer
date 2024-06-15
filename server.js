const express = require('express')

const app = express()

const PORT = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send(`api running on port ${PORT} \n hello`)
})

app.listen(PORT, () => console.log(`server running on port ${PORT}`))
