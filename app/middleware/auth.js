'use strict';

/**
 * auth鉴权中间件
 * @return {any} meaningless
 * 返回值是没有意义的
 * 随手 return 是一个好习惯
 */
module.exports = () => {
  return async function auth(ctx, next) {
    let { DIGKEY } = ctx.session;
    if (!DIGKEY) {
      ctx.session.DIGKEY = DIGKEY = `${Math.random()}`.slice(-6);
    }
    ctx.logger.warn({ DIGKEY });
    const { TOKEN } = ctx.session;
    // TOKEN 用来鉴权
    if (!TOKEN || ctx.cookies.get('TOKEN') !== TOKEN) {
      // TODO 温馨提示中间页
      ctx.body = {
        code: -1,
        message: '需要验证',
      };
      return;
    }
    // 跟踪用户
    ctx.userId = ctx.session.user_id;
    return await next();
  };
};
