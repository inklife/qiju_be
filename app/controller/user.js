'use strict';

const ms = require('ms');
const shortid = require('shortid');
const crypto = require('crypto');
const md5 = _ => crypto.createHash('md5').update(_.toString()).digest('hex');

const Controller = require('egg').Controller;

class UserController extends Controller {
  async login() {
    const { ctx } = this;
    const { email, phone, password } = ctx.request.body;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // TODO 参数校验
    const { code, user_id } = await this.service.user.login({ email, phone, password });
    if (code === 1) {
      // 设置登录成功的Cookies
      const DIGKEY = `${Math.random()}`.slice(-6); // 用来混淆的key，存在服务端
      ctx.session.user_id = user_id; // 记下user_id
      ctx.session.DIGKEY = DIGKEY;
      const TOKEN = md5(user_id + DIGKEY); // 用来鉴权的TOKEN，存在客户端
      ctx.cookies.set('TOKEN', TOKEN, { maxAge: ms('6h') });
      ctx.session.TOKEN = TOKEN; // 服务端也存一份吧，（大雾
      ctx.body = {
        status: 200,
        code: '1',
      };
      // 随手return是个好习惯
      return;
    }
    // 登录失败
    ctx.body = {
      status: 400,
      code: '-1',
      message: '登录失败',
    };
  }

  async register() {
    const { ctx } = this;
    const { email, phone, gender, region, password } = ctx.request.body;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // TODO 检查用户是否存在 TYPE
    const exist = await this.service.user.checkUserDuplicate({ email });
    // console.log(exist);
    if (exist) {
      ctx.body = {
        status: 200,
        code: '-1',
        message: '似乎在哪里见过你',
      };
      return;
    }
    // TODO 参数校验
    const salt = `${Math.random()}`.slice(-6);
    const user_id = shortid.generate();
    const resp = await this.service.user.register(user_id, password, salt,
      email, phone, gender, region);
    // console.log(resp);
    if (resp) {
      ctx.body = {
        // status: 200,
        code: '1',
      };
    }
  }
}

module.exports = UserController;
