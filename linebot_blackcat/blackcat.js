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
      var validate = new Promise( (resolve, reject) => {
        var current = userList.filter(function(item, index, array){
        return item.user.displayName ==  profile.displayName;
        });
        resolve(current);
      });
      validate.then(current => {
        if(Object.keys(current).length > 0){
          console.log("驗證使用者資料已存在_加入類");
        }
        else if(Object.keys(current).length == 0){
          console.log("驗證使用者資料不存在-加入新資料_加入類");
          user = {
            id:event.source.userId,
            displayName:profile.displayName,
            terms:false
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
        console.dir("event:");
        console.dir(event);
        console.dir("userList");
        console.dir(userList);
        console.dir(Object.keys(userList));
    
    
        console.dir("profile");
        console.dir(profile);
        console.dir("////////////////////////");

      }, reason => {
          console.log(reason); // Error!
      });
    }







  });
});

bot.on('message', function (event) {
  event.source.profile().then(function (profile) {
    if(event.source.type == 'user'){
      var validate = new Promise( (resolve, reject) => {
        var current = userList.filter(function(item, index, array){
        return item.user.displayName ==  profile.displayName;
        });
        resolve(current);
      });
      validate.then(current => {
        console.log("當前對話者_聊天類");
        if(Object.keys(current).length > 0){
          console.log("驗證使用者資料已存在_聊天類");
          console.log(current);
        }
        else if(Object.keys(current).length == 0){
          console.log("驗證使用者資料不存在-加入新資料_聊天類");
          user = {
            id:event.source.userId,
            displayName:profile.displayName,
            terms:false,
            phoneValidate:false
          }
          // 加入歷史資料集中
          userList = userList.concat([{
            user:user
          }]);
          // 將新加入的使用者先放進當前使用者資料集中
          current = current.concat([{
            user:user
          }]);;
          console.log(current);
        }
        else if(Object.keys(current).length > 1){
          console.log("有同名的使用者!!請聯繫開發者!");
        }

        /** 語意判定區域 同意條款才會進來 */
        if(user.terms){

          /** 手機驗證區 */
          if(event.message.text.match(/^09\d{8}$/) && !user.phoneValidate || event.message.text== "重新發送驗證碼" && !user.phoneValidate) {
            event.reply([
              {
                type: 'template',
                altText: 'this is a buttons template',
                template: {
                  type: 'buttons',
                  title: ' ',
                  text: '我們已經透過手機簡訊，傳送認證碼至您的手機，請在此回傳認證碼已完成手機認證程序',
                  actions: [{
                    type: 'message',
                    label: '重新輸入電話',
                    text: '重新輸入電話'
                  }, {
                    type: 'message',
                    label: '重新發送驗證碼',
                    text: '重新發送驗證碼'
                  }]
                }
              }
            ]).then(function (data) {
              console.log('Success', data);
            }).catch(function (error) {
              console.log('Error', error);
            });
          }
          else if(event.message.text == "123456" && !user.phoneValidate){
            user.phoneValidate == true;
            event.reply([
              {type: 'text', text: "認證完成"},
              {
                type: 'template',
                altText: '設定-寄件人',
                template: {
                  type: 'buttons',
                  thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
                  title: '設定-寄件人',
                  text: '請先完成 設定寄件人',
                  actions: [{
                    type: 'message',
                    label: '設定',
                    text: '設定'
                  }]
                }
              }
            ]).then(function (data) {
              console.log('Success', data);
            }).catch(function (error) {
              console.log('Error', error);
            });
          }

          /** 手機驗證成功後才會進來 */
          if(user.phoneValidate){
            if(event.message.text == "設定" ){
              event.reply([
                {type: 'text', text: "設定-寄件人完成！"},
                {
                  type: 'location',
                  title: '台北市',
                  address: '114內湖區瑞湖街17號',
                  latitude: 25.074754,
                  longitude: 121.576547
                },
                {
                  type: 'template',
                  altText: '確認地址-寄件人',
                  template: {
                    type: 'confirm',
                    text: '此地址是否正確?',
                    actions: [{
                      type: 'message',
                      label: '正確',
                      text: '正確'
                    }, {
                      type: 'message',
                      label: '重新輸入',
                      text: '重新輸入'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }
            
            event.reply({
              type: 'template',
              altText: 'this is a carousel template',
              template: {
                type: 'carousel',
                columns: [{
                  thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
                  title: 'this is menu',
                  text: 'description',
                  actions: [{
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=111'
                  }, {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=111'
                  }, {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/111'
                  }]
                }, {
                  thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
                  title: 'this is menu',
                  text: 'description',
                  actions: [{
                    type: 'postback',
                    label: 'Buy',
                    data: 'action=buy&itemid=222'
                  }, {
                    type: 'postback',
                    label: 'Add to cart',
                    data: 'action=add&itemid=222'
                  }, {
                    type: 'uri',
                    label: 'View detail',
                    uri: 'http://example.com/page/222'
                  }]
                }]
              }
            });



          }

        }

        /** 預設條款 */
        if(event.message.text == "我同意"){
          user.terms = true;
          event.reply([
            { type: 'text', text: "感謝您同意本公司的使用者條款以及隱私權聲明。" },
            { type: 'text', text: "歡迎使用黑貓! 請先輸入您的手機號碼完成認證。\n(例如：09XX XXX XXX)" }
          ]).then(function (data) {
            console.log('Success', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }

        if(!user.terms && event.message.text != "我同意"){
          event.reply([
            { type: 'text', text: "黑貓宅急便 寄件超簡單，讓你輕鬆預約叫件，最終會給予QR Code,須自行至7-11,OK超商印出託運單" },
            {
              type: 'template',
              altText: '使用者條款',
              template: {
                type: 'buttons',
                title: '使用者條款',
                text: '點選"我同意"即代表您已詳閱.了解，並同意本公司的使用者條款以及隱私權聲明內之相關使用者規範',
                actions: [{
                  type: 'uri',
                  label: '使用者條款',
                  uri: 'https://www.google.com.tw'
                }, {
                  type: 'uri',
                  label: '隱私權聲明',
                  uri: 'https://fb.com'
                }, {
                  type: 'message',
                  label: '我同意',
                  text: '我同意'
                }, {
                  type: 'message',
                  label: '取消',
                  text: '取消'
                }]
              }
            }
          ]).then(function (data) {
            console.log('Success', data);
          }).catch(function (error) {
            console.log('Error', error);
          });

          ////////////////////////////////////////////dev//////////////////////////////
          if(event.message.text == "h"){
            user.terms = true;
            user.phoneValidate = true;
            event.reply([
              { type: 'text', text: "你作弊!!" }
            ]).then(function (data) {
              console.log('Success', data);
            }).catch(function (error) {
              console.log('Error', error);
            });
          }
          ////////////////////////////////////////////dev//////////////////////////////
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

      }, reason => {
          console.log(reason); // Error!
      });
    }

    if(event.message.text == '資料'){
        event.reply(event.source.userId + " \n " + profile.displayName).then(function (data) {
        console.log('Success', data);
      }).catch(function (error) {
        console.log('Error', error);
      });
    }

   

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
