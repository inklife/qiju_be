'use strict';
// app/extend/helper.js
const crypto = require('crypto');
const sha1 = str => crypto.createHash('sha1').update(str).digest('hex');
/**
 * ctx.helper 的扩展方法
 * 建议这里只扩展简单的计算类同步方法
 * 如果有异步操作
 * 建议扩展 app 对象 或者 service.helper
 */
module.exports = {
  // 生成鉴权Token
  generateToken(openid, uuid) {
    return sha1(openid + uuid + this.app.config.wechat.token);
  },
  // 加盐编码 UserID
  encryptUserid(str) {
    return sha1(str + this.app.config.xreader.salt);
  },
  // 计算 otherDay - day 的时间差天数
  // 注意 day、otherDay 均为 timestamp
  // 不要误传 Date 对象
  // 当前时间戳 -> Date.now()
  // Date 对象 转时间戳 -> +new Date() 、 new Date().getTime() 等
  calculateDayDistance(day, otherDay) {
    const dateTime = 1000 * 60 * 60 * 24; // 每一天的毫秒数
    const minusDays = Math.floor(((otherDay - day) / dateTime)); // 计算出两个日期的天数差
    return minusDays; // ~~取绝对值~~ 不取绝对值了，现在
  },
};
