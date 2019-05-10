'use strict';

/**
 * captcha 验证码校验中间件
 * @return {any} meaningless
 * 返回值是没有意义的
 * 随手 return 是一个好习惯
 */
module.exports = () => {
  return async function captcha(ctx, next) {
    // captcha 鉴权
    if (ctx.session.captcha !== ctx.query.captcha) {
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
