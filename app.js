const shell = require('shelljs');
const moment = require('moment');
const conf = require('./config');
shell.echo('hello world');


const random = () => (Math.floor(Math.random() * 15) + 30)
// const random = () => (1)

const get_start_time = () => moment(moment().format('YYYY-MM-DD')).add(conf.go_hour, 'hour').subtract((random()), 'minute').format('YYYY-MM-DD HH:mm');
const get_last_time = () => moment(moment().format('YYYY-MM-DD')).add(conf.back_hour, 'hour').add((4), 'minute').format('YYYY-MM-DD HH:mm');
let default_delay = 1000;
let start_time = get_start_time();
let last_time = get_last_time();


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
        shell.exec(`adb shell input keyevent 26  ${conf.directory}`);
    })
}

// 返回桌面
const back_desktop = () => {
    delay(() => {
        logs('返回桌面');
        shell.exec(`adb shell input keyevent 3  ${conf.directory}`);
    })
}

// 关闭钉钉
const close_dd = () => {
    delay(() => {
        logs('关闭钉钉');
        shell.exec(`adb shell am force-stop com.alibaba.android.rimet ${conf.directory}`);
    })
}

// 打开钉钉
const open_dd = () => {
    delay(() => {
        logs('打开钉钉');
        shell.exec(`adb shell monkey -p com.alibaba.android.rimet -c android.intent.category.LAUNCHER 1  ${conf.directory}`);
    })
}

// click_imitate 模拟点击
const click_imitate = (position) => {
    delay(() => {
        console.log(`adb shell input tap ${position.map((d) => d)}`.replace(/,/g, ' '));
        shell.exec(`adb shell input tap ${position.map((d) => d)}`.replace(/,/g, ' '));
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
        if (moment().format('YYYY-MM-DD HH:mm') === '23:59:59') {
            start_time = get_start_time();
            last_time = get_last_time();
        }
        if ((new Date().getHours()) < conf.go_hour) {
            logs(`下次上班打卡时间 ${start_time}`)
        } else {
            logs(`下次下班打卡时间 ${last_time}`)
        }

        if (moment().format('YYYY-MM-DD HH:mm') === start_time) {
            start_work_flow();
        } else if (moment().format('YYYY-MM-DD HH:mm') === last_time) {
            Work_flow();
        }
    }, 1000 * 60)
}
run();