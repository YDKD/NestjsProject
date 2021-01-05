/*
 * @Author: your name
 * @Date: 2021-01-05 17:24:39
 * @LastEditTime: 2021-01-05 17:34:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \NestjsProject\src\utils\index.ts
 */
//随机数
function random(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

//随机4位验证码
export function verifyCode() {
    //将数字、小写字母及大写字母输入
    var str = "1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM";
    //给一个空字符串
    var res = '';
    //循环4次，得到4个字符
    for (var i = 0; i < 4; i++) {
        //将得到的结果给字符串，调用随机函数，0最小数，62表示数字加字母的总数
        res += str[random(0, 62)];
    }
    return res
}


// 判断验证码是否过期
export function codeOverdue(startime, stoptime) {
    if (startime < stoptime) {
        let currTime = ++startime
        codeOverdue(currTime, stoptime)
    } else {
        return true
    }
}
