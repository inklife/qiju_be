'use strict';

const Service = require('egg').Service;

class EmailService extends Service {
  // 返回值为messageId，失败则为空串
  async SendVerificationCode(account) {
    const VerificationCode = this.ctx.helper.random(6);
    const info = await this.app.email.sendMail({
      from: '"栖居" <we@iiiovo.com>', // sender address
      to: account, // list of receivers
      subject: '栖居 - 安全操作验证码', // Subject line
      text: `您好，您本次操作的验证码为${VerificationCode}，有效期为15分钟。如非您本人操作，请忽略。`, // plain text body
      html: `您好，您本次操作的验证码为<b>${VerificationCode}</b>，有效期为15分钟。如非您本人操作，请忽略。`, // html body
    });
    if (info.messageId) {
      // 记下验证码，过期时间15分钟
      await this.app.redis.set(
        `${account}|VerificationCode`,
        VerificationCode,
        'EX', // EX 模式，过期时间秒计
        900
      );
      return info.messageId;
    }
    return '';
  }
}

module.exports = EmailService;
