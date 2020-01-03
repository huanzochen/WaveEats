const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');

const bot = linebot({
	channelId: '1653588682',
	channelSecret: '3a2b851c50bae56f27ff66c037c18505',
	channelAccessToken: 'izJrvNE3Axr3OzFgsx3eqo1WLKZKeugeiH8GFt2iA36yceFjg4U6oMr6Pa6+/LMiGNiW1/Qalr7Psgy5jVHyGfye0OxCV3puxUhB+NXrZBRvSFi1u0qOck09qkKmFnw0uDR6Ut3N9SoEZmMmaPW7mAdB04t89/1O/w1cDnyilFU='
});

const app = express();

const parser = bodyParser.json({
  verify: function (req, res, buf, encoding) {
    req.rawBody = buf.toString(encoding);
  }
});

app.post('/linewebhook', parser, function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400);
  }
  bot.parse(req.body);
  return res.json({});
});

// 加入聊天室時跟對方打招呼
bot.on('join', function (event) {
  event.source.profile().then(function (profile) {
    event.push(event.source.userId, event.message.text + profile.displayName).then(function (data) {
      console.log('Success', data);
    }).catch(function (error) {
      console.log('Error', error);
    });
  });
});

bot.on('message', function (event) {
  event.source.profile().then(function (profile) {
    if(event.message.text == '資料'){
      event.reply(event.source.userId + " \n " + profile.displayName).then(function (data) {
        console.log('Success', data);
      }).catch(function (error) {
        console.log('Error', error);
      });
    }
    console.dir(event);
    console.dir(event.message);
    console.dir(event.message.text);
    console.log("\n");
  });
});

/*
bot.on('message', function (event) {
  event.source.profile().then(function (profile) {
    event.reply("1").then(function (data) {
      bot.on('message', function (event) {
        event.source.profile().then(function (profile) {
          event.reply("2").then(function (data) {
            bot.on('message', function (event) {
              event.source.profile().then(function (profile) {
                event.reply("3").then(function (data) {
                  console.log('Success', data);
                }).catch(function (error) {
                  console.log('Error', error);
                });
              });
            });
          }).catch(function (error) {
            console.log('Error', error);
          });
        });
      });
      console.log('Success', data);
    }).catch(function (error) {
      console.log('Error', error);
    });
  });
});
*/

app.listen(process.env.PORT || 3200, function () {
  console.log('LineBot is running.');
});
