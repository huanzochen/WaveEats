const linebot = require('linebot');
const express = require('express');
const bodyParser = require('body-parser');

const bot = linebot({
	channelId: process.env.CHANNEL_ID || '1653599208',
	channelSecret: process.env.CHANNEL_SECRET || 'afaee0b417042750892ba943efc985a8',
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '+lplVlN6npehzrRbjWBIuD1r+QqlTr4EALlmtTXz9MwLLmUAQlcVChTbhuu3hjleX4ieRa9RaAwLJJFkWJ+Kh7qMIUIpJUPRQXaKY5egkP91sFOtONucFSzUgAAqYUn8IVH4qDXaGEFggxMg9US/TwdB04t89/1O/w1cDnyilFU='
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
            terms:false,
            phoneValidate:false,
            recipient:null,
            recipientDate:null,
            senderDate:null,
            senderDateAssign:null,
            propType:null
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

      console.log("user");
      var validate = new Promise( (resolve, reject) => {
        var current = userList.filter(function(item, index, array){
          console.dir("validate item");
          console.dir(item);
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
            phoneValidate:false,
            recipient:null,
            recipientDate:null,
            senderDate:null,
            senderDateAssign:null,
            propType:null
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


        ////////////////////////////////////////////dev//////////////////////////////
        if(event.message.text == "dev"){
          event.reply([
            {
              type: 'template',
              altText: 'dev',
              template: {
                type: 'buttons',
                title: '恭喜你!!',
                text: '打開了神祕小選單，請問您要?',
                actions: [{
                  type: 'message',
                  label: '小作弊(同意條款、電話驗證)',
                  text: 'SystemCall.Cheat'
                },{
                  type: 'message',
                  label: '大作弊(小作弊、收寄件日期))',
                  text: 'SystemCall.CheatAll'
                }, {
                  type: 'message',
                  label: '忘了一切(重置)',
                  text: 'SystemCall.Reset'
                }]
              }
            }
          ]).then(function (data) {
            console.log('Success dev', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        else if(event.message.text == "SystemCall.Cheat"){
          event.reply([
            { type: 'text', text: "你作弊!!(通過條款、電話驗證)" }
          ]).then(function (data) {
            user.terms = true;
            user.phoneValidate = true;
            console.log('Success SystemCall.Cheat', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        else if(event.message.text == "SystemCall.CheatAll"){
          event.reply([
            { type: 'text', text: "你作弊!!(通過條款、電話驗證、寄件日收件日)" }
          ]).then(function (data) {
            user.terms = true;
            user.phoneValidate = true;
            user.recipientDate = '2020-01-07';
            user.senderDate = '2020-01-07';
            console.log('Success SystemCall.CheatAll', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        else if(event.message.text == "SystemCall.Reset"){
          user = {
            id:event.source.userId,
            displayName:profile.displayName,
            terms:false,
            phoneValidate:false,
            recipient:null,
            recipientDate:null,
            senderDate:null,
            senderDateAssign:null,
            propType:null
          }
          userList.splice(userList.findIndex(e => e.id === profile.userId), 1);
          // 加入歷史資料集中
          userList = userList.concat([{
            user:user
          }]);
          /*
          user.terms=false;
          user.phoneValidate=false;
          user.recipient=null;
          user.recipientDate=null;
          user.senderDate=null;
          user.senderDateAssign=null;
          user.propType=null;
          */

          event.reply([
            { type: 'text', text: "什麼都忘了...!!(狀態已重置)" }
          ]).then(function (data) {
            console.log('Success SystemCall.Reset', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        ////////////////////////////////////////////dev//////////////////////////////




        /** 預設條款 */
        else if(event.message.text == "我同意"){
          user.terms = true;
          event.reply([
            { type: 'text', text: "感謝您同意本公司的使用者條款以及隱私權聲明。" },
            { type: 'text', text: "歡迎使用黑貓! 請先輸入您的手機號碼完成認證。\n(例如：09XX XXX XXX)" }
          ]).then(function (data) {
            console.log('Success 我同意', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }

        else if(!user.terms && event.message.text != "我同意"){
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
            console.log('Success 預設', data);
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        /** 預設條款 結束 */

        /** 同意條款才會進來 */
        if(user.terms){

          /** 手機驗證區 */
          if(event.message.text.replace(/\s*/g,"").match(/^09\d{8}$/) && !user.phoneValidate || event.message.text== "重新發送驗證碼" && !user.phoneValidate) {
            event.reply([
              {
                type: 'template',
                altText: 'this is a buttons template',
                template: {
                  type: 'buttons',
                  title: ' ',
                  text: '我們已經透過手機簡訊，傳送認證碼至您的手機，請在此回傳認證碼已完成手機認證程序(驗證碼:123456)',
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
            console.log("123456");
            event.reply([
              {type: 'text', text: "認證完成"},
              {
                type: 'template',
                altText: '設定-寄件人',
                template: {
                  type: 'buttons',
                  thumbnailImageUrl: 'https://i.imgur.com/43AiwZ0.jpg',
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
              user.phoneValidate = true;
              console.log('Success', data);
              console.log(user);
            }).catch(function (error) {
              console.log('Error', error);
            });
          }

          /** 手機驗證成功後才會進來 */
          else if(user.phoneValidate){

            /** 已填寫寄件人、收件人地址 */
            if(user.senderDate != null && user.recipientDate != null){

              if( event.message.text == "不指定" || event.message.text == "13時以前" || event.message.text == "14-18時"){
                event.reply([
                  {
                    type: 'template',
                    altText: '請選擇物品內容',
                    template: {
                      type: 'buttons',
                      title: '請選擇物品內容',
                      text: '選擇內容',
                      actions: [{
                        type: 'message',
                        label: '易碎物品',
                        text: '易碎物品'
                      }, {
                        type: 'message',
                        label: '精密儀器',
                        text: '精密儀器'
                      }, {
                        type: 'message',
                        label: '其他',
                        text: '其他'
                      }]
                    }
                  }
                ]).then(function (data) {
                  console.log('Success 物品內容', data);
                  console.dir("event");
                  console.dir(event);
                  user.senderDateAssign = event.message.text;
                }).catch(function (error) {
                  console.log('Error', error);
                });
              }
              else if( event.message.text == "易碎物品" || event.message.text == "精密儀器" || event.message.text == "其他"){
                event.reply([
                  {
                    type: 'text',
                    text: "您好！請選擇內容類別\n1.其他\n2.文件\n3.家電3C\n4.水果\n5.麵粉"
                  }
                ]).then(function (data) {
                  console.log('Success 內容類別', data);
                  user.propType = event.message.text;
                }).catch(function (error) {
                  console.log('Error', error);
                });
              }


            }

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
            else if(event.message.text == "寄件" ){
              event.reply([
                {
                  type: 'template',
                  altText: '寄件選單',
                  template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://i.imgur.com/v0gS4cH.jpg',
                    title: '選擇常用收件地址',
                    text: '請選擇常用收件地址',
                    actions: [{
                      type: 'message',
                      label: '常用收件地址',
                      text: '常用收件地址'
                    }, {
                      type: 'message',
                      label: '設定常用收件地址',
                      text: '設定常用收件地址'
                    }, {
                      type: 'message',
                      label: '直接輸入',
                      text: '直接輸入'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }
            else if(event.message.text == "直接輸入" ){
              event.reply([
                {type: 'text', text: "您好！請輸入收件地址以及資訊。\n例如：李曉明/09XX XXX XXX/台北市XX區XXX路XX號XX樓"}
              ]).then(function (data) {
                console.log('Success', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }

            // 收件者輸入地址檢核
            else if(event.message.text.match(/[\u4e00-\u9fa5]{1,15}\/09\d{8}\/[\u4e00-\u9fa5]{1,500}/)){
              user.recipient = event.message.text; 
              event.reply([
                {
                  type: 'template',
                  altText: '選擇日期畫面',
                  template: {
                    type: 'buttons',
                    thumbnailImageUrl: 'https://i.imgur.com/wdwmaGe.jpg',
                    title: '選擇日期',
                    text: '請選擇寄件.到達日期',
                    actions: [{
                      type: "datetimepicker",
                      "label": "選擇-寄件日期",
                      "data": "recipientDate",
                      "mode": "date"
                    }, {
                      type: "datetimepicker",
                      "label": "選擇-到達日期",
                      "data": "senderDate",
                      "mode": "date"
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success 日期畫面', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }

            else
            {
              // 常規用戶選單
              event.reply({
                type: 'template',
                altText: '用戶選單',
                template: {
                  type: 'carousel',
                  columns: [{
                    thumbnailImageUrl: 'https://i.imgur.com/dOBVbjp.jpg',
                    title: '統智科技你好!',
                    text: '歡迎使用黑貓預約寄件服務，請選擇以下的服務',
                    actions: [{
                      type: 'message',
                      label: '常用地址寄件',
                      text: '常用地址寄件'
                    }, {
                      type: 'message',
                      label: '寄件',
                      text: '寄件'
                    }, {
                      type: 'message',
                      label: '設定',
                      text: '設定'
                    }]
                  }, {
                    thumbnailImageUrl: 'https://i.imgur.com/378AknI.jpg',
                    title: '其他服務',
                    text: '請選擇以下的服務',
                    actions: [{
                      type: 'message',
                      label: '客服',
                      text: '客服'
                    }, {
                      type: 'message',
                      label: '常見問題',
                      text: '常見問題'
                    }, {
                      type: 'message',
                      label: '訂單',
                      text: '訂單'
                    }]
                  }]
                }
              });
            }
          }
          /** 手機驗證成功後才會進來 結束 */
        }
        /** 同意條款才會進來 結束*/
        

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
        console.dir("user");
        console.dir(user);
        console.dir("replace");
        console.dir(event.message.text.replace(/\s*/g,""));
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

bot.on('postback', function (event) {
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
            terms:false,
            phoneValidate:false,
            recipient:null,
            recipientDate:null,
            senderDate:null,
            senderDateAssign:null,
            propType:null
          }
          userList = userList.concat([{
            user:user
          }]);
        }

        // 判斷是寄件日期還是收件日期
        if(event.postback.data == "recipientDate"){
          event.reply([
            {type: 'text', text: "寄件日期:" + event.postback.params.date}
          ]).then(function (data) {
            user.recipientDate = event.postback.params.date;
            console.log('Success 寄件日期', data);
            if(user.senderDate != null && user.recipientDate != null){
              bot.push(user.id, [
                {
                  type: 'template',
                  altText: '配達時段',
                  template: {
                    type: 'buttons',
                    title: '請選擇配達時段',
                    text: '選擇配達',
                    actions: [{
                      type: 'message',
                      label: '不指定',
                      text: '不指定'
                    }, {
                      type: 'message',
                      label: '13時以前',
                      text: '13時以前'
                    }, {
                      type: 'message',
                      label: '14-18時',
                      text: '14-18時'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success 配達時段1', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }
          }).catch(function (error) {
            console.log('Error', error);
          });
        }
        else if(event.postback.data == "senderDate"){
          event.reply([
            {type: 'text', text: "到達日期:" + event.postback.params.date}
          ]).then(function (data) {
            user.senderDate = event.postback.params.date;
            console.log('Success 到達日期', data);
            if(user.senderDate != null && user.recipientDate != null){
              bot.push(user.id, [
                {
                  type: 'template',
                  altText: '配達時段',
                  template: {
                    type: 'buttons',
                    title: '請選擇配達時段',
                    text: '選擇配達',
                    actions: [{
                      type: 'message',
                      label: '不指定',
                      text: '不指定'
                    }, {
                      type: 'message',
                      label: '13時以前',
                      text: '13時以前'
                    }, {
                      type: 'message',
                      label: '14-18時',
                      text: '14-18時'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success 配達時段2', data);
              }).catch(function (error) {
                console.log('Error', error);
              });
            }
          }).catch(function (error) {
            console.log('Error', error);
          });
        }


        
        /*
        event.reply([
          {type: 'text', text: event.postback.params.date}
        ]).then(function (data) {
          console.log('Success', data);
        }).catch(function (error) {
          console.log('Error', error);
        });
        */

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
})

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
