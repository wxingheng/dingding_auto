const shell = require('shelljs');
const moment = require('moment');
const conf = require('./config');
const nodemailer = require("nodemailer");
const fs = require('fs');
const path = require('path');
const mineType = require('mime-types');

const AipOcrClient = require("baidu-aip-sdk").ocr;
// 设置APPID/AK/SK
const APP_ID = "14617464";
const API_KEY = "pxUG2m2KBbN9eq9EhZxhaRc2";
const SECRET_KEY = "kmWAi5qmsIs6aH4GkWHvZVq9bUBKkRAy";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

const HttpClient = require("baidu-aip-sdk").HttpClient;

// 设置request库的一些参数，例如代理服务地址，超时时间等
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestOptions({
    timeout: 5000
});

// 也可以设置拦截每次请求（设置拦截后，调用的setRequestOptions设置的参数将不生效）,
// 可以按需修改request参数（无论是否修改，必须返回函数调用参数）
// request参数请参考 https://github.com/request/request#requestoptions-callback
HttpClient.setRequestInterceptor(function (requestOptions) {
    // 查看参数
    // console.log(requestOptions)
    // 修改参数
    requestOptions.timeout = 5000;
    // 返回参数
    return requestOptions;
});










shell.echo('自动打开已启动...');


const random = () => (Math.floor(Math.random() * 15) + 15)
// const random = () => (1)

const get_start_time = () => moment(moment().format('YYYY-MM-DD')).add(conf.go_hour, 'hour').subtract((random()), 'minute').format('YYYY-MM-DD HH:mm');
const get_last_time = () => moment(moment().format('YYYY-MM-DD')).add(conf.back_hour, 'hour').add((2), 'minute').format('YYYY-MM-DD HH:mm');
let default_delay = 1000;
let start_time = get_start_time();
let last_time = get_last_time();
let num = 10;


const logs = (str) => {
    console.log(`log: ${str}`);
}

const delay = (fun) => {
    default_delay += conf.step_time;
    setTimeout(() => {
        fun();
    }, default_delay);
}

// 点亮屏幕
const lighten = () => {
    delay(() => {
        logs('点亮屏幕');
        shell.exec(`adb -s ${conf.devices} shell input keyevent 26  ${conf.directory}`);
    })
}

// 返回桌面
const back_desktop = () => {
    delay(() => {
        logs('返回桌面');
        shell.exec(`adb -s ${conf.devices} shell input keyevent 3  ${conf.directory}`);
    })
}

// 关闭钉钉
const close_dd = () => {
    delay(() => {
        logs('关闭钉钉');
        shell.exec(`adb -s ${conf.devices} shell am force-stop com.alibaba.android.rimet ${conf.directory}`);
    })
}

// 打开钉钉
const open_dd = () => {
    delay(() => {
        logs('打开钉钉');
        shell.exec(`adb -s ${conf.devices} shell monkey -p com.alibaba.android.rimet -c android.intent.category.LAUNCHER 1  ${conf.directory}`);
    })
}

// click_imitate 模拟点击
const click_imitate = (position) => {
    delay(() => {
        shell.exec(`adb -s ${conf.devices} shell input tap ${position.map((d) => d)}`.replace(/,/g, ' '));
    })
}
// 点击钉钉工作
const click_work = () => {
    logs('点击钉钉工作');
    click_imitate(conf.work_position);
}

// 点击钉钉考勤打卡
const click_check = () => {
    logs('点击考勤打卡');
    click_imitate(conf.check_position);
}

// 下班打卡
const work_off = () => {
    logs('点击下班打卡');
    click_imitate(conf.work_off);
}
// 上班打卡
const start_work = () => {
    logs('点击上班打卡');
    click_imitate(conf.work_start);
}

// 清除缓存
const clear_cache = () => {
    logs('清除缓存');
    default_delay = 1000;
    num = num + 1;
}

// 截图 并保存指定路径
const printscreen = () => {
    delay(() => {
        logs('截图并保存');
        shell.exec(`adb -s ${conf.devices} shell screencap -p sdcard/screen${num}.png`);
        shell.exec(`adb -s ${conf.devices} pull sdcard/screen${num}.png ${conf.screen_path}`);
        // shell.exec(`adb pull sdcard/screen${num}.png E:/study/Electron/Angular-electron/new-hoslink-client-core/DingDingAutoPlayCard/dingding_node/screen`);

    })
}

// 发送到邮箱
const send_email = () => {
    delay(() => {
        logs('发送到邮箱');
        let filePath = path.resolve(`screen/screen${num}.png`);
        let image = fs.readFileSync(filePath);
        let text = '';
        image = new Buffer(image).toString('base64');
        // 调用通用文字识别, 图片参数为本地图片
        client.generalBasic(image).then(function (result) {
            // console.log(JSON.stringify(result));
            const v = result.words_result.filter(d => d.words.search('打卡时间') !== -1);
            text = v.map(d => d.words);
            let base64 = 'data:' + mineType.lookup(filePath) + ';base64,' + image;
            const transporter = nodemailer.createTransport(`smtps://${conf.email}:${conf.email_token}@smtp.qq.com`);
            const mailOptions = {
                from: `${conf.email}`, //发信邮箱
                to: `${conf.email}`, //接收者邮箱
                subject: "打卡截图", //邮件主题
                text: "Hello！",
                html: `<p>${text}</p><img src="${base64}">`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return console.log(error);
                }
                logs('Message sent: ' + info.response);
            });
            start_time = get_start_time();
            last_time = get_last_time();
        }).catch(function (err) {
            // 如果发生网络错误
            console.log(err);
        });
    })
}



// 下班打卡流程
const Work_flow = function () {
    clear_cache();
    lighten()
    back_desktop();
    close_dd();
    open_dd();
    click_work();
    click_check();
    work_off();
    printscreen();
    send_email();
}

// 上班打卡流程
const start_work_flow = function () {
    clear_cache();
    lighten()
    back_desktop();
    close_dd();
    open_dd();
    click_work();
    click_check();
    start_work();
    printscreen();
    send_email();
}

// 周末
const isWeekend = () => {
    if(new Date().getDay() == 6 || new Date().getDay() == 0){
        return true;
    }else{
        return false;
    }
}

// start_work_flow();
const run = () => {
    if ((new Date().getHours()) < conf.go_hour) {
        logs(`下次上班打卡时间 ${start_time}`)
    } else {
        logs(`下次下班打卡时间 ${last_time}`)
    }
    setInterval(() => {
        // 每天重置 打卡时间
        if (moment().format('HH:mm') === '00:01' || moment().format('HH:mm') === '00:02' || moment().format('HH:mm') === '00:03') {
            start_time = get_start_time();
            last_time = get_last_time();
        }
        if ((new Date().getHours()) < conf.go_hour) {
            logs(`下次上班打卡时间 ${start_time}`)
        } else {
            logs(`下次下班打卡时间 ${last_time}`)
        }

        if (moment().format('YYYY-MM-DD HH:mm') === start_time || moment().add(1, 'min').format('YYYY-MM-DD HH:mm') === start_time|| moment().add(2, 'min').format('YYYY-MM-DD HH:mm') === start_time) {
            start_work_flow();
        } else if (moment().format('YYYY-MM-DD HH:mm') === last_time  || moment().add(1, 'min').format('YYYY-MM-DD HH:mm') === start_time|| moment().add(2, 'min').format('YYYY-MM-DD HH:mm') === start_time) {
            Work_flow();
        }
    }, 1000 * 60 * 3)
}
run();