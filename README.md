## project_blackcat

# 說明:
這個專案目前部署在Heroku上
一隻會說話的linebot

## Require:
LINE Channel (需至LINE Developer申請):
- LINE LIFF 
- messaging API

others: 
- nodejs 10.10.0  

## Debug

查看log的方法:
```
heroku login
heroku logs --tail -a -app_name

// example like:
// heroku logs --tail -a linebot-blackcat
```

## ngrok (本地偵錯)
怎麼在本地偵錯?
請參閱 https://ngrok.com/   
一個可以將流量導向到本地的服務 

只要在LINE Developer上將webhook改成ngrok提供的url即可本地偵錯(記得要使用https的連結)  
LINEBOT流程圖:
![image](https://github.com/huanzochen/project_line_blackcat/blob/master/doc/ngrok%E6%B5%81%E7%A8%8B%E5%9C%96_new.png)

