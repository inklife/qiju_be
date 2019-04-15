'use strict';
const path = require('path');

module.exports = appInfo => {

  const config = exports = {};

  // 日志配置
  config.logger = {
    dir: '/home/www/logs/qiju',
  };
  config.logrotator = {
    filesRotateByHour: [
      path.join(config.logger.dir, `${appInfo.name}-web.log`),
    ],
    maxDays: 300,
  };

  config.qiju = {
    namespace: '/qiju',
    host: 'https://qiju.art',
    salt: '!^_^~123abC',
  };

  // 数据库配置
  config.mysql = {
    // 单数据库信息配置
    client: {
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'qiju',
      charset: 'utf8mb4',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // redis 配置
  config.redis = {
    client: {
      port: 6381,
      host: '127.0.0.1',
      password: 'pYfpXyd7',
      db: 2,
    },
  };

  return config;
};
