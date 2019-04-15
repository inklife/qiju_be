'use strict';

module.exports = {
  schedule: {
    cron: '30 17 * * *',
    type: 'worker',
  },

  async task() {
    // // 刷新 notify_list
    // const app = ctx.app;
    // const config = app.config;
    // const { prefix } = config.wechat;
    // const key = prefix + 'notify_list';
    // // 清除
    // await app.redis.set(key, '');
    // // 刷新
    // await ctx.service.helper.getNotifyList();
    // ctx.logger.info('update notify list done.');
    // // 其他任务
  },
};
