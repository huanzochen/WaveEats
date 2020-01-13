##project_blackcat

##說明:
這個專案目前部署在Heroku上
是一隻linebot

##Require:
nodejs 10.10.0

##Debug

查看log的方法:
```
heroku login
heroku logs --tail -a -app_name

// example like:
// heroku logs --tail -a linebot-blackcat
```

##ngrok (本地偵錯)
怎麼在本地偵錯?
請參閱 https://ngrok.com/ 
一個可以將流量導向到本地的服務
LINEBOT流程圖:
![image](picture or gif url)
https://drive.google.com/file/d/1gZl1KMwTJ57Ckaiw31UAOI4oQt2M37rd/view?usp=sharing

