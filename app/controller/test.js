'use strict';

const Controller = require('egg').Controller;
/**
 * 测试用
 */
class TestController extends Controller {
  async echo() {
    const { ctx } = this;
    ctx.body = '👉';
  }
}

module.exports = TestController;
