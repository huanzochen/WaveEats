require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const botRouter = require('./routes/bot')
const path = require('path')


// LIFF
const myLiffId = process.env.MY_LIFF_ID

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

// LIFF
app.get('/send-id', function (req, res) {
  res.json({ id: myLiffId })
})

const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding)
  }
})

app.use('/linewebhook', parser, botRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.listen(process.env.PORT || 3200, function () {
  console.log('LineBot is running.')
})
