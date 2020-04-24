## WaveEats

# 說明:
因為中午都不知道要吃什麼而誕生出的一個幫你解決選擇困難症的 Bot

這隻機器人的前身是 黑貓宅急便, 因此裡面會有一些垃圾, 緩慢刪除中...

## Require:
LINE Channel (需至LINE Developer申請):
- LINE LIFF 
- messaging API

others: 
- nodejs 10.19.0  

## Debug

trace log 的方法 ( on Heroku )
```
heroku login
heroku logs --tail -a -app_name

// example like:
// heroku logs --tail -a linebot-blackcat
```

## ngrok ( local debug)
怎麼在本地偵錯?
請參閱 https://ngrok.com/   
一個可以將流量導向到本地的服務 

只要在LINE Developer上將webhook改成ngrok提供的url即可本地偵錯(記得要使用https的連結)  
LINEBOT流程圖:
![image](https://github.com/huanzochen/project_line_blackcat/blob/master/doc/ngrok%E6%B5%81%E7%A8%8B%E5%9C%96_new.png)

