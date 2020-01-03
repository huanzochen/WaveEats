const linebot = require('linebot');
const express = require('express');

const bot = linebot({
	channelId: '1653588682',
	channelSecret: '3a2b851c50bae56f27ff66c037c18505',
	channelAccessToken: 'izJrvNE3Axr3OzFgsx3eqo1WLKZKeugeiH8GFt2iA36yceFjg4U6oMr6Pa6+/LMiGNiW1/Qalr7Psgy5jVHyGfye0OxCV3puxUhB+NXrZBRvSFi1u0qOck09qkKmFnw0uDR6Ut3N9SoEZmMmaPW7mAdB04t89/1O/w1cDnyilFU='
});

const app = express();

const linebotParser = bot.parser();

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
	event.reply(event.message.text).then(function (data) {
		console.log('Success', data);
	}).catch(function (error) {
		console.log('Error', error);
	});
});

app.listen(process.env.PORT || 3000, function () {
	console.log('LineBot is running.');
});