require('dotenv').config()
var express = require('express')
var router = express.Router()
const linebot = require('linebot')

/** 使用者 */
var userList = []
var user = []

const bot = linebot({
  channelId: process.env.CHANNEL_ID || '1653599208',
  channelSecret: process.env.CHANNEL_SECRET || 'afaee0b417042750892ba943efc985a8',
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '+lplVlN6npehzrRbjWBIuD1r+QqlTr4EALlmtTXz9MwLLmUAQlcVChTbhuu3hjleX4ieRa9RaAwLJJFkWJ+Kh7qMIUIpJUPRQXaKY5egkP91sFOtONucFSzUgAAqYUn8IVH4qDXaGEFggxMg9US/TwdB04t89/1O/w1cDnyilFU='
})

// define the home page route
router.post('/', function (req, res) {
  if (!bot.verify(req.rawBody, req.get('X-Line-Signature'))) {
    return res.sendStatus(400)
  }
  bot.parse(req.body)
  return res.json({})
})

// 加入聊天室時跟對方打招呼
bot.on('follow', function (event) {
  event.source.profile().then(function (profile) {
    if (event.source.type === 'user') {
      var validate = new Promise((resolve, reject) => {
        var current = userList.filter(function (item, index, array) {
          return item.user.displayName === profile.displayName
        })
        resolve(current)
      })
      validate.then(current => {
        if (Object.keys(current).length > 0) {
          console.log('驗證使用者資料已存在_加入類')
        } else if (Object.keys(current).length === 0) {
          console.log('驗證使用者資料不存在-加入新資料_加入類')
          user = {
            id: event.source.userId, // 使用者ID
            displayName: profile.displayName, // 使用者名稱
            terms: false, // 是否同意條款
            phoneValidate: false, // 是否同意電話驗證
            recipient: null, // 收件地址以及資訊
            recipientDate: null, // 收件日期
            senderDate: null, // 寄件日期
            senderDateAssign: null, // 指定到達時間
            propType: null, // 物品內容
            category: null, // 內容類別
            status: null // 當前狀態 (紀錄當前步驟用)
          }
          userList = userList.concat([{
            user: user
          }])
        }
        bot.push(
          event.source.userId,
          profile.userId + profile.displayName
        ).then(function (data) {
          console.log('Success', data)
        }).catch(function (error) {
          console.log('Error', error)
        })

        console.dir('///////////////debug push/////////')
        console.dir('event:')
        console.dir(event)
        console.dir('userList')
        console.dir(userList)
        console.dir(Object.keys(userList))

        console.dir('profile')
        console.dir(profile)
        console.dir('////////////////////////')
      }, reason => {
        console.log(reason) // Error!
      })
    }
  })
})

/**
 * user.status 列表
 * newcomer 新訪客
 * member 已註冊會員
 * phonevalidating 正在接受電話驗證中...
 * inputdirectly 直接輸入地址
 * inputcommon 使用常用收件地址
 * waitingforpackageconfirm 正在等待輸入品名
 */

bot.on('message', function (event) {
  event.source.profile().then(function (profile) {
    if (event.source.type === 'user') {
      console.log('user')
      var validate = new Promise((resolve, reject) => {
        var current = userList.filter(function (item, index, array) {
          console.dir('validate item')
          console.dir(item)
          return item.user.displayName === profile.displayName
        })
        resolve(current)
      })
      validate.then(current => {
        console.log('當前對話者_聊天類')
        if (Object.keys(current).length > 0) {
          console.log('驗證使用者資料已存在_聊天類')
          console.log(current)
        } else if (Object.keys(current).length === 0) {
          console.log('驗證使用者資料不存在-加入新資料_聊天類')
          user = {
            id: event.source.userId, // 使用者ID
            displayName: profile.displayName, // 使用者名稱
            terms: false, // 是否同意條款
            phoneValidate: false, // 是否同意電話驗證
            recipient: null, // 收件地址以及資訊
            recipientDate: null, // 收件日期
            senderDate: null, // 寄件日期
            senderDateAssign: null, // 指定到達時間
            propType: null, // 物品內容
            category: null, // 內容類別
            status: null // 當前狀態 (紀錄當前步驟用)
          }
          // 加入歷史資料集中
          userList = userList.concat([{
            user: user
          }])
          // 將新加入的使用者先放進當前使用者資料集中
          current = current.concat([{
            user: user
          }])
          console.log(current)
        } else if (Object.keys(current).length > 1) {
          console.log('有同名的使用者!!請聯繫開發者!')
        }

        // 檢核是否為已註冊會員
        if (user.status === null) {
          if (user.terms && user.phoneValidate) {
            user.status = 'member'
          }
        }

        /// /////////////////////////////////////////dev//////////////////////////////

        if (event.message.text === 'test') {
          event.reply([
            {
              type: 'flex',
              altText: 'this is a flex message',
              contents: {
                type: 'bubble',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Header text'
                    }
                  ]
                },
                hero: {
                  type: 'image',
                  url: 'https://crazypetter.com.tw/wp-content/uploads/2019/07/BLOW-%E6%88%90%E9%95%B7%E5%8F%B2_190413_0911.jpg'
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Body text'
                    }
                  ]
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: 'Footer text'
                    }
                  ]
                },
                styles: {
                  header: {
                    backgroundColor: '#00ffff'
                  },
                  hero: {
                    separator: true,
                    separatorColor: '#000000'
                  },
                  footer: {
                    backgroundColor: '#00ffff',
                    separator: true,
                    separatorColor: '#000000'
                  }
                }
              }
            }
          ]).then(function (data) {
            console.log('Success dev', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.message.text === 'test2') {
          event.reply([
            {
              type: 'template',
              altText: 'dev',
              template: {
                type: 'buttons',
                title: 'dev',
                text: '打開了神祕小選單，請問您要?',
                actions: [{
                  "type": "postback",
                  "label": "Buy",
                  "data": "action=buy&itemid=111",
                  "text": "Buy"
                }]
              }
            }
          ]).then(function (data) {
            console.log('Success dev', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.message.text === 'map') {

        } else if (event.message.text === 'dev' || event.message.text === '訂單') {
          event.reply([
            {
              type: 'template',
              altText: 'dev',
              template: {
                type: 'buttons',
                title: 'dev',
                text: '打開了神祕小選單，請問您要?',
                actions: [{
                  type: 'message',
                  label: '條款+電話(完成註冊流程)',
                  text: 'be_member'
                }, {
                  type: 'message',
                  label: '完成寄件(產生寄件確認圖樣)',
                  text: 'be_done'
                }, {
                  type: 'message',
                  label: '忘了一切(重置)',
                  text: 'get_reset'
                }]
              }
            }
          ]).then(function (data) {
            console.log('Success dev', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.message.text === 'be_member' || event.message.text === '重新寄件') {
          event.reply([
            { type: 'text', text: '通過條款、電話驗證(完成註冊流程) 輸入任意字元進入下一步' }
          ]).then(function (data) {
            user = {
              id: event.source.userId, // 使用者ID
              displayName: profile.displayName, // 使用者名稱
              terms: false, // 是否同意條款
              phoneValidate: false, // 是否同意電話驗證
              recipient: null, // 收件地址以及資訊
              recipientDate: null, // 收件日期
              senderDate: null, // 寄件日期
              senderDateAssign: null, // 指定到達時間
              propType: null, // 物品內容
              category: null, // 內容類別
              status: null // 當前狀態 (紀錄當前步驟用)
            }
            userList.splice(userList.findIndex(e => e.id === profile.userId), 1)
            // 加入歷史資料集中
            userList = userList.concat([{
              user: user
            }])
            user.terms = true
            user.phoneValidate = true
            console.log('Success be_member', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.message.text === 'be_done') {
          event.reply([
            { type: 'text', text: '完成寄件流程進入寄件確認畫面 輸入任意字元進入下一步 ' }
          ]).then(function (data) {
            user.terms = true
            user.phoneValidate = true
            user.recipient = '臺北市信義區忠孝東路5段1之8號12樓'
            user.recipientDate = '2020-01-07'
            user.senderDate = '2020-01-07'
            user.senderDateAssign = '不指定'
            user.propType = '易碎物品'
            user.category = '麵粉'
            user.status = 'watingforpackageconfirm'
            user.packagename = 'chxjx'
            console.log('Success be_done', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.message.text === 'get_reset') {
          user = {
            id: event.source.userId, // 使用者ID
            displayName: profile.displayName, // 使用者名稱
            terms: false, // 是否同意條款
            phoneValidate: false, // 是否同意電話驗證
            recipient: null, // 收件地址以及資訊
            recipientDate: null, // 收件日期
            senderDate: null, // 寄件日期
            senderDateAssign: null, // 指定到達時間
            propType: null, // 物品內容
            category: null, // 內容類別
            status: null // 當前狀態 (紀錄當前步驟用)
          }
          userList.splice(userList.findIndex(e => e.id === profile.userId), 1)
          // 加入歷史資料集中
          userList = userList.concat([{
            user: user
          }])

          event.reply([
            { type: 'text', text: '狀態已重置' }
          ]).then(function (data) {
            console.log('Success get_reset', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        }
        /// /////////////////////////////////////////dev//////////////////////////////

        /** 預設條款 */
        else if (event.message.text === '我同意' && user.status === 'newcomer') {
          event.reply([
            { type: 'text', text: '感謝您同意本公司的使用者條款以及隱私權聲明。' },
            { type: 'text', text: '歡迎使用黑貓! 請先輸入您的手機號碼完成認證。\n(例如：09XX XXX XXX)' }
          ]).then(function (data) {
            console.log('Success 同意條款完成!', data)
            user.terms = true
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (!user.terms && event.message.text !== '我同意') {
          event.reply([
            { type: 'text', text: '黑貓宅急便 寄件超簡單，讓你輕鬆預約叫件，最終會給予QR Code,須自行至7-11,OK超商印出託運單' },
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
            user.status = 'newcomer'
            console.log('Success 預設', data)
          }).catch(function (error) {
            console.log('Error', error)
          })
        }
        /** 預設條款 結束 */

        /** 同意條款才會進來 */
        if (user.terms) {
          console.log('檢核-已同意條款')

          /** 手機驗證區 */
          if ((event.message.text.replace(/\s*/g, '').match(/^09\d{8}$/) && !user.phoneValidate) || (event.message.text === '重新發送驗證碼' && !user.phoneValidate)) {
            console.log('檢核-手機號碼驗證碼發送程序')
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
              console.log('Success 手機號碼輸入完成!', data)
              user.status = 'phonevalidating'
            }).catch(function (error) {
              console.log('Error', error)
            })
          } else if (event.message.text === '123456' && !user.phoneValidate && user.status === 'phonevalidating') {
            console.log('檢核-驗證碼程序')
            event.reply([
              { type: 'text', text: '認證完成' },
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
              user.phoneValidate = true
              user.status = 'member'
              console.log('Success 手機號碼驗證成功!', data)
            }).catch(function (error) {
              console.log('Error', error)
            })
          }

          /** 手機驗證成功後才會進來 */
          else if (user.phoneValidate) {
            console.log('檢核-已通過手機驗證')
            /** 已填寫寄件時間、收件時間 */
            if (user.senderDate != null && user.recipientDate != null) {
              console.log('檢核-指定時間選擇')
              /** 已填寫物品內容、內容類別 */
              if (user.propType !== null && user.category !== null) {
                if (user.status === 'watingforpackageconfirm' && event.message.text === '確認') {
                  event.reply([
                    {
                      type: 'image',
                      originalContentUrl: 'https://i.imgur.com/CIfuFDd.png',
                      previewImageUrl: 'https://i.imgur.com/CIfuFDd.png'
                    }
                  ]).then(function (data) {
                    user.status = 'member'
                    console.log('Success 寄件成功!', data)
                  }).catch(function (error) {
                    console.log('Error', error)
                  })
                } else if (user.status === 'watingforpackageconfirm') {
                  console.log('檢核-拋送地址確認圖案')
                  event.reply([
                    {
                      type: 'image',
                      originalContentUrl: 'https://i.imgur.com/uzWOVwr.png',
                      previewImageUrl: 'https://i.imgur.com/uzWOVwr.png'
                    },
                    {
                      type: 'template',
                      altText: '確認寄件?',
                      template: {
                        type: 'confirm',
                        text: '確認寄件?',
                        actions: [{
                          type: 'message',
                          label: '重新寄件',
                          text: '重新寄件'
                        }, {
                          type: 'message',
                          label: '確認',
                          text: '確認'
                        }]
                      }
                    }
                  ]).then(function (data) {
                    console.log('Success 拋送地址確認圖案', data)
                    user.packagename = event.message.text
                  }).catch(function (error) {
                    console.log('Error', error)
                  })
                }
              }

              if (event.message.text === '不指定' || event.message.text === '13時以前' || event.message.text === '14-18時') {
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
                  console.log('Success 物品內容選擇', data)
                  console.dir('event')
                  console.dir(event)
                  user.senderDateAssign = event.message.text
                }).catch(function (error) {
                  console.log('Error', error)
                })
              } else if (event.message.text === '易碎物品' || event.message.text === '精密儀器' || event.message.text === '其他') {
                console.log('檢核-內容類別選擇')
                event.reply([
                  {
                    type: 'text',
                    text: '您好！請選擇內容類別\n1.其他\n2.文件\n3.家電3C\n4.水果\n5.麵粉'
                  }
                ]).then(function (data) {
                  console.log('Success 內容類別選擇', data)
                  user.propType = event.message.text
                }).catch(function (error) {
                  console.log('Error', error)
                })
              } else if (event.message.text === '1' || event.message.text === '2' || event.message.text === '3' || event.message.text === '4' || event.message.text === '5') {
                console.log('內容類別')
                event.reply([
                  {
                    type: 'text',
                    text: '您好！請輸入品名'
                  }
                ]).then(function (data) {
                  switch (event.message.text) {
                    case '1':
                      user.category = '其他'
                      break
                    case '2':
                      user.category = '文件'
                      break
                    case '3':
                      user.category = '家電3C'
                      break
                    case '4':
                      user.category = '水果'
                      break
                    case '5':
                      user.category = '麵粉'
                      break
                  }
                  user.status = 'watingforpackageconfirm'
                  console.log('Success 品名輸入', data)
                }).catch(function (error) {
                  console.log('Error', error)
                })
              }
            } else if (event.message.text === '設定') {
              event.reply([
                { type: 'text', text: '設定-寄件人完成！' },
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
                console.log('Success 按下設定按鈕!', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            } else if (event.message.text === '寄件' || event.message.text === '常用地址寄件') {
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
                      label: '直接輸入',
                      text: '直接輸入'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success 顯示寄件選單', data)
                user.status = 'inputcommon' // 使用常用收件地址
              }).catch(function (error) {
                console.log('Error', error)
              })
            } else if (event.message.text === '直接輸入') {
              event.reply([
                { type: 'text', text: '您好！請輸入收件地址以及資訊。\n例如：李曉明/09XX XXX XXX/台北市XX區XXX路XX號XX樓' }
              ]).then(function (data) {
                user.status = 'inputdirectly' // 直接輸入地址
                console.log('Success 直接輸入地址', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            } else if ((event.message.text.match(/[\u4e00-\u9fa5]{1,15}\/09\d{8}\/[\u4e00-\u9fa5]{7,500}/) && user.status === 'inputdirectly') || (event.message.text.match(/[\u4e00-\u9fa5]{7,500}/) && user.status === 'inputcommon')) {
              user.recipient = event.message.text
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
                      type: 'datetimepicker',
                      label: '選擇-寄件日期',
                      data: 'senderDate',
                      mode: 'date'
                    }, {
                      type: 'datetimepicker',
                      label: '選擇-到達日期',
                      data: 'recipientDate',
                      mode: 'date'
                    }]
                  }
                }
              ]).then(function (data) {
                console.log('Success 日期選擇畫面', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            } else if (event.message.text === '常用收件地址') {
              event.reply({
                type: 'template',
                altText: '用戶選單',
                template: {
                  type: 'buttons',
                  thumbnailImageUrl: 'https://i.imgur.com/v0gS4cH.jpg',
                  title: '設定-常用收件地址!',
                  text: '請選擇常用收件地址',
                  actions: [
                    {
                      type: 'message',
                      label: '臺北市信義區忠孝東路5段1之8號12樓',
                      text: '臺北市信義區忠孝東路5段1之8號12樓'
                    }, {
                      type: 'message',
                      label: '嘉義縣太保市故宮大道888號',
                      text: '嘉義縣太保市故宮大道888號'
                    }, {
                      type: 'message',
                      label: '屏東縣恆春鎮燈塔路90號',
                      text: '屏東縣恆春鎮燈塔路90號'
                    }, {
                      type: 'uri',
                      label: '更多',
                      uri: 'line://app/1653821039-n0YBYazr'
                    }]
                }
              }).then(function (data) {
                user.status = 'inputcommon' // 使用常用收件地址
                console.log('Success 顯示常用收件地址選單', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            } else if (user.status === 'member') {
              console.log('檢核-常規用戶選單')
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
                      type: 'uri',
                      label: '客服',
                      uri: 'https://www.t-cat.com.tw/CallCenter/WebContact.aspx'
                    }, {
                      type: 'uri',
                      label: '常見問題',
                      uri: 'https://www.t-cat.com.tw/qa/services.aspx'
                    }, {
                      type: 'message',
                      label: '訂單',
                      text: '訂單'
                    }]
                  }]
                }
              }).then(function (data) {
                console.log('Success 顯示常規用戶選單', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            }
          } else {
            console.log('檢核-常規手機號碼認證')
            event.reply([
              { type: 'text', text: '感謝您同意本公司的使用者條款以及隱私權聲明。' },
              { type: 'text', text: '歡迎使用黑貓! 請先輸入您的手機號碼完成認證。\n(例如：09XX XXX XXX)' }
            ]).then(function (data) {
              console.log('Success 手機號碼驗證', data)
              user.terms = true
            }).catch(function (error) {
              console.log('Error', error)
            })
          }
          /** 手機驗證成功後才會進來 結束 */
        }
        /** 同意條款才會進來 結束 */

        console.dir('///////////////debug reply/////////')
        console.dir('event:')
        console.dir(event)
        console.dir('event.message:')
        console.dir(event.message)
        console.dir('event.message.text:')
        console.dir(event.message.text)
        console.log('\n')
        console.dir('debug-profile lineapi的profile')
        console.dir(profile)
        console.dir('debug-userList 使用者總表')
        console.dir(userList)
        console.dir('debug-user 當前使用者')
        console.dir(user)
        console.log('////////////////////////' + ' \n ' + ' \n ' + ' \n ' + ' \n ' + ' \n ')
      }, reason => {
        console.log(reason) // Error!
      })
    }

    if (event.message.text === '資料') {
      event.reply(event.source.userId + ' \n ' + profile.displayName).then(function (data) {
        console.log('Success', data)
      }).catch(function (error) {
        console.log('Error', error)
      })
    }
  })
})

bot.on('postback', function (event) {
  event.source.profile().then(function (profile) {
    if (event.source.type === 'user') {
      var validate = new Promise((resolve, reject) => {
        var current = userList.filter(function (item, index, array) {
          return item.user.displayName === profile.displayName
        })
        resolve(current)
      })
      validate.then(current => {
        if (Object.keys(current).length > 0) {
          console.log('驗證使用者資料已存在_回傳類')
        } else if (Object.keys(current).length === 0) {
          console.log('驗證使用者資料不存在-加入新資料_回傳類')
          user = {
            id: event.source.userId, // 使用者ID
            displayName: profile.displayName, // 使用者名稱
            terms: false, // 是否同意條款
            phoneValidate: false, // 是否同意電話驗證
            recipient: null, // 收件地址以及資訊
            recipientDate: null, // 收件日期
            senderDate: null, // 寄件日期
            senderDateAssign: null, // 指定到達時間
            propType: null, // 物品內容
            category: null, // 內容類別
            status: null // 當前狀態 (紀錄當前步驟用)
          }
          userList = userList.concat([{
            user: user
          }])
        }

        // 判斷是寄件日期還是收件日期
        if (event.postback.data === 'senderDate') {
          event.reply([
            { type: 'text', text: '寄件日期:' + event.postback.params.date }
          ]).then(function (data) {
            user.senderDate = event.postback.params.date
            console.log('Success 收到寄件日期', data)
            if (user.senderDate != null && user.recipientDate != null) {
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
                console.log('Success 如果寄件及收件日期皆有則詢問配達時段成功', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            }
          }).catch(function (error) {
            console.log('Error', error)
          })
        } else if (event.postback.data === 'recipientDate') {
          event.reply([
            { type: 'text', text: '收件日期:' + event.postback.params.date }
          ]).then(function (data) {
            user.recipientDate = event.postback.params.date
            console.log('Success 收到收件日期', data)
            if (user.senderDate != null && user.recipientDate != null) {
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
                console.log('Success 如果寄件及收件日期皆有則詢問配達時段成功', data)
              }).catch(function (error) {
                console.log('Error', error)
              })
            }
          }).catch(function (error) {
            console.log('Error', error)
          })
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

        console.dir('///////////////debug push/////////')
        console.dir('event:')
        console.dir(event)
        console.dir('userList')
        console.dir(userList)
        console.dir(Object.keys(userList))

        console.dir('profile')
        console.dir(profile)
        console.dir('////////////////////////')
      }, reason => {
        console.log(reason) // Error!
      })
    }
  })
})

module.exports = router

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
if(event.message.text === "一根菸抽不夠") {
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
