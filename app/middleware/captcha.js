'use strict';

const _ = require('loadsh');
/*
 * captcha 验证码校验中间件
 */
module.exports = () => {
  return async function captcha(ctx, next) {
    // captcha 鉴权
    if (
      _.isEmpty(ctx.query.captcha) ||
      _.isEmpty(ctx.session.captcha) ||
      ctx.session.captcha !== ctx.query.captcha
    ) {
      ctx.body = {
        code: -1,
        message: '图形验证码有误',
      };
      return;
    }
    // 抛给下一个中间件
    return await next();
  };
};
