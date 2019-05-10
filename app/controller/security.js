'use strict';

const Controller = require('egg').Controller;
const svgCaptcha = require('svg-captcha');

class SecurityController extends Controller {
  async captcha() {
    const ctx = this.ctx;
    const captcha = svgCaptcha.create();
    ctx.session.captcha = captcha.text;
    ctx.type = 'image/svg+xml';
    ctx.body = captcha.data;
  }
}

module.exports = SecurityController;
