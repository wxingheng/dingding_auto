


# 钉钉自动打 001      
----
钉钉自动上下班打卡辅助
----
----
基于windows10 ,node.10，adb，安卓手机实现。需要安装adb 和 node运行环境。原理：通过node逻辑化的调度cmd来执行adb来操作安卓手机。

# 准备 windows电脑一台；能装钉钉的安卓手机一部；

## 1.安装 ADB：
----
windows版本adb下载地址:
[https://adb.clockworkmod.com/](https://adb.clockworkmod.com/)
### 安装完成后，把adb.exe所在文件夹路径加入环境变量Path中。
![1.添加adb到path](https://github.com/1414044032/imgs/blob/master/adbinstall.png)
![2.添加adb到path](https://github.com/1414044032/imgs/blob/master/adbpath.png)
![3.添加adb到path](https://github.com/1414044032/imgs/blob/master/path1.png)
### 手机需要打开开发者选项，通过USB数据线连接电脑。
### 打开CMD命令行，输入“adb devices”,能成功显示手机信息即可。

## 2.安装node
----
windows版本adb下载地址:
[https://nodejs.org/zh-cn/](https://nodejs.org/zh-cn/)
### 打开CMD命令行，输入“node -v”,能成功显示手机信息即可。


## 3.获取屏幕尺寸，设置模拟点击位置：
可以自己截图 把像素点的位置填写到  config.js 里面

----
### 像素点的获取：
----
![screen1](https://github.com/1414044032/imgs/blob/master/screen1.png)
![screen2](https://github.com/1414044032/imgs/blob/master/screen2.png)
### 画图工具打开保存到电脑的设备截图：
----
![screen3](https://github.com/1414044032/imgs/blob/master/screen3.png)
![screen4](https://github.com/1414044032/imgs/blob/master/screen4.png)
![screen5](https://github.com/1414044032/imgs/blob/master/screen5.png)


## 4.运行：  或者用 pm2 挂起
----
运行： 'node app.js'
----
![screen7](https://github.com/1414044032/imgs/blob/master/screen7.png)

## 5.参考资料：
----
[https://github.com/1414044032/DingDingAutoPlayCard](https://github.com/1414044032/DingDingAutoPlayCard)
----

测试命令

###

截屏

```
adb shell screencap -p sdcard/screen.png
adb pull  sdcard/screen.png E:\dingding
```

###

点亮屏幕

```
adb shell input keyevent 26 E:\Universal Adb Driver
```

###

打开钉钉

```
adb shell monkey -p com.alibaba.android.rimet -c android.intent.category.LAUNCHER 1  E:\Universal Adb Driver
```

###

关闭钉钉

```
adb shell am force-stop com.alibaba.android.rimet E:\Universal Adb Driver
```

###

返回桌面

```
adb shell input keyevent 3 E:\Universal Adb Driver
```

###

点击工作

```
adb shell input tap 540 1818
```

###

点击考勤打卡

```
adb shell input tap 678 1626
```

###

点击上班打卡  -------

```
adb shell input tap 678 1626
```

###

点击上班打卡  -------

```
adb shell input tap 535 1233
