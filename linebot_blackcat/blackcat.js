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

/** 使用者 */
var userList = [];


app.post('/linewebhook', parser, function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400);
  }
  bot.parse(req.body);
  return res.json({});
});

// 加入聊天室時跟對方打招呼
bot.on('follow', function (event) {
  event.source.profile().then(function (profile) {
    if(event.source.type == 'user'){
      /*
      if(!userList.user.id.find(profile.userId)){

      }
      */
      user = {
        id:event.source.userId,
        displayName:profile.displayName
      }
      userList = userList.concat([{
        user:user
      }]);
    }


    bot.push(
      event.source.userId, 
      profile.userId +　profile.displayName
    ).then(function (data) {
      console.log('Success', data);
    }).catch(function (error) {
      console.log('Error', error);
    });

    console.dir("///////////////debug push/////////");
    console.dir("userList");
    console.dir(userList);
    console.dir(Object.keys(userList));
    var isExist = userList.filter(function(item, index, array){
      console.log("item");
      console.log(item);
      console.log("array");
      console.log(array);
      return item.user.displayName ==  profile.displayName;
    });
    
    /*
    .then( ()=>{
        if(isExist.Length > 0){
          console.log("isExist");
          console.log(isExist);
        }
      }
    )
    */

    console.dir("profile");
    console.dir(profile);
    console.dir("////////////////////////");


  });
});

bot.on('message', function (event) {
  event.source.profile().then(function (profile) {
    //console.log(userList.user.id.find(profile.userId));
    if(event.source.type == 'user'){

      /*
      for(i = 0,i < userList.Length,i++){

      }
      */
          user = {
          id:event.source.userId,
          displayName:profile.displayName
          }
          userList = userList.concat([{
            user:user
          }])
     // }
    }

    if(event.message.text == '資料'){
        event.reply(event.source.userId + " \n " + profile.displayName).then(function (data) {
        console.log('Success', data);
      }).catch(function (error) {
        console.log('Error', error);
      });
    }

   
    console.dir("///////////////debug reply/////////");
    console.dir("event:");
    console.dir(event);
    console.dir("event.message:");
    console.dir(event.message);
    console.dir("event.message.text:");
    console.dir(event.message.text);
    console.log("\n");
    console.dir("profile");
    console.dir(profile);
    console.dir("userList");
    console.dir(userList);
    console.dir("////////////////////////");
  });
});

/*
if(event.message.text.indexOf("宏") >= 0) {
  event.reply(event.message.text + "好帥").then(function (data) {
    console.log('Success', data);
  }).catch(function (error) {
    console.log('Error', error);
  });
}
if(event.message.text.indexOf("女友") >= 0) {
  event.reply("我全部建議分手").then(function (data) {
    console.log('Success', data);
  }).catch(function (error) {
    console.log('Error', error);
  });
}
if(event.message.text.indexOf("菸") >= 0) {
  event.reply("戒掉").then(function (data) {
    console.log('Success', data);
  }).catch(function (error) {
    console.log('Error', error);
  });
}
if(event.message.text == "一根菸抽不夠") {
  event.reply("那就抽兩根").then(function (data) {
    console.log('Success', data);
  }).catch(function (error) {
    console.log('Error', error);
  });
}
*/

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

app.listen(process.env.PORT || 3201, function () {
  console.log('LineBot is running.');
});
