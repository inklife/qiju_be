'use strict';
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this;
    ctx.body = 'Hi, ThinkPHP is now in ' + app.config.env + ' mode. —— 2019年04月15日11:40:58。';
  }
}

module.exports = HomeController;
