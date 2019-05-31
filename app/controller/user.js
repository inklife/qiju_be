'use strict';

const ms = require('ms');
const shortid = require('shortid');
const crypto = require('crypto');
const md5 = _ =>
  crypto
    .createHash('md5')
    .update(_.toString())
    .digest('hex');

const Parameter = require('parameter');
const Check = new Parameter();

const Controller = require('egg').Controller;

class UserController extends Controller {
  // POST 登录
  async login() {
    const { ctx } = this;
    const { email, phone, password, rememberme } = ctx.request.body;
    // 日志输出
    ctx.logger.info({ email, phone, rememberme });
    // TODO 参数校验
    const { code, user_id } = await this.service.user.login({
      email,
      phone,
      password,
    });
    if (code === 1) {
      // 设置登录成功的Cookies
      const DIGKEY = `${Math.random()}`.slice(-6); // 用来混淆的key，存在服务端
      const TOKEN = md5(user_id + DIGKEY); // 用来鉴权的TOKEN，存在客户端
      if (rememberme === true) {
        // 如果勾选记住我，session有效期延长至7天
        ctx.session.maxAge = ms('7d');
        ctx.session.user_id = user_id; // 记下user_id
        ctx.session.DIGKEY = DIGKEY;
        ctx.cookies.set('TOKEN', TOKEN, { maxAge: ms('7d') });
        ctx.session.TOKEN = TOKEN; // 服务端也存一份吧，（大雾
      } else {
        ctx.session.user_id = user_id; // 记下user_id
        ctx.session.DIGKEY = DIGKEY;
        ctx.cookies.set('TOKEN', TOKEN, { maxAge: ms('6h') });
        ctx.session.TOKEN = TOKEN; // 服务端也存一份吧，（大雾
      }
      ctx.body = {
        code: 1,
      };
      // 随手return是个好习惯
      return;
    }
    // 登录失败
    ctx.body = {
      // 用 `code` 表示状态即可
      code: -1,
      message: '登录失败',
    };
  }
  // GET 登出
  async logout() {
    const { ctx } = this;
    if (ctx.session.user_id) {
      delete ctx.session.user_id;
    } else {
      ctx.body = {
        code: 1,
      };
      return;
    }
    if (ctx.session.DIGKEY) {
      delete ctx.session.DIGKEY;
    }
    if (ctx.session.TOKEN) {
      delete ctx.session.TOKEN;
    }
    ctx.logger.info('登出成功');
    ctx.body = {
      code: 1,
    };
  }
  // 返回在线用户user_id
  async online() {
    const { ctx } = this;
    if (ctx.session.user_id) {
      ctx.body = {
        code: 1,
        data: {
          user_id: ctx.session.user_id,
        },
      };
    } else {
      ctx.body = {
        code: -1,
      };
    }
  }
  // 返回在线用户资料
  async getUserInfo() {
    const { ctx } = this;
    const user_id = ctx.session.user_id;
    if (user_id) {
      const {
        email,
        gender,
        phone,
        qq,
        region,
        user_image,
        user_name,
        wechat,
      } = await this.service.user.getUserInfo({ user_id });
      ctx.body = {
        code: 1,
        data: {
          email,
          gender,
          phone,
          qq,
          region,
          user_id,
          user_image,
          user_name,
          wechat,
        },
      };
    } else {
      ctx.body = {
        code: -1,
      };
    }
  }
  // POST 注册
  async register() {
    const { ctx } = this;
    const {
      email,
      phone,
      gender,
      region,
      password,
      user_name,
    } = ctx.request.body;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // TODO 检查用户是否存在 TYPE
    const exist = await this.service.user.checkUserDuplicate({ email });
    // console.log(exist);
    if (exist) {
      ctx.body = {
        code: -1,
        message: '似乎在哪里见过你',
      };
      return;
    }
    // TODO 参数校验
    const salt = `${Math.random()}`.slice(-6);
    const user_id = shortid.generate();
    const resp = await this.service.user.register(
      user_id,
      password,
      salt,
      email,
      phone,
      gender,
      region,
      user_name
    );
    // console.log(resp);
    if (resp) {
      ctx.body = {
        // status: 200,
        code: 1,
      };
    }
  }
  // POST 更新用户资料
  // 前置 AUTH 中间件，确保用户已经登录
  async updateUserPage() {
    const { ctx } = this;
    const { user_image, gender, region, user_name } = ctx.request.body;
    const user_id = ctx.session.user_id;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    const rule = {
      user_image: { type: 'string', required: true, allowEmpty: false },
      user_name: { type: 'string', required: true, allowEmpty: false },
      gender: { type: 'enum', required: true, values: [ 'male', 'female' ] },
      region: {
        type: 'enum',
        required: true,
        values: [ 'rongchang', 'beibei', 'other' ],
      },
    };

    const errors = Check.validate(rule, ctx.request.body);
    if (errors) {
      ctx.body = {
        code: -1,
        errors,
      };
      return;
    }
    // resp 为本次修改数据库影响行数是否为1行 的逻辑值
    const resp = await this.service.user.updateUserPage(user_id, {
      user_image,
      user_name,
      gender,
      region,
    });
    if (resp) {
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: '修改失败',
    };
  }
  // 重置密码
  async resetPassword() {
    const { ctx } = this;
    const { email, vercode, password } = ctx.request.body;
    // 过滤用户密码等敏感信息
    const fiterInfo = Object.assign({}, ctx.request.body, {
      password: '**----**',
    });
    // 日志输出
    ctx.logger.info(fiterInfo);
    const pwdCode = await this.app.redis.get(`${email}|VerificationCode`);
    if (pwdCode !== vercode) {
      ctx.body = {
        code: -1,
        message: '情况不对，溜了溜了~',
      };
      return;
    }
    // 重置密码
    const resp = await this.service.user.resetPassword(email, password);
    if (resp.code === 1) {
      // 密码重置成功 作废邮箱验证码
      this.app.redis.del(`${email}|VerificationCode`);
      // 返回
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = resp;
  }
}

module.exports = UserController;
