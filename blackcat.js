const express = require('express');
const bodyParser = require('body-parser');
const botRouter = require('./routes/bot');



const app = express();

const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding);
  }
});

app.use('/linewebhook', parser, botRouter);

app.listen(process.env.PORT || 3201, function () {
  console.log('LineBot is running.');
});
