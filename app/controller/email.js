'use strict';

const Controller = require('egg').Controller;

class EmailController extends Controller {
  async SendVerificationCode() {
    const { ctx } = this;
    const email = ctx.request.body.email;
    if (!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(email)) {
      ctx.body = {
        code: -1,
        message: '似乎格式不太对',
      };
      return;
    }
    const resp = await this.service.email.SendVerificationCode(email);
    if (resp) {
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: '邮件发送失败',
    };
  }
}

module.exports = EmailController;
