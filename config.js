module.exports = {
    // adb 的安装绝对路径
    directory: 'D:\adb\Universal Adb Driver',
    // 上班时间
    go_hour: 9,
    // 下班时间 
    back_hour: 18.5,
    // 点击工作的像素位置点
    work_position: [540, 1818],
    // 点击考勤打卡的像素未位置点
    check_position: [678, 1618],
    // 上班打卡的像素位置点
     work_start: [552, 801],
    // 下班打卡的像素位置点
    work_off: [538, 1223],
    // 每一步的时间
    step_time: 7000,
    // qq邮箱 打卡成功  将只用qq邮箱给自己发一封邮件
    email: '1228678518@qq.com',
    // 邮箱密钥   
    email_token: 'dzurdbumhdlgichd',
    // 你的设备代号   adb devices 可以获取到
    devices: '91QEBP8563ST',
    // 项目 screen 的跟目录绝对路径
    screen_path: 'D:/dingdingdaka/dingding_auto-master/screen'
}