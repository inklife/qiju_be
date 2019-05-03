'use strict';

const os = require('os');
const path = require('path');
const ms = require('ms');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + 'b$sh&YB!{?`0U.7dj)+';

  // 日志配置
  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  // cluster 配置
  config.cluster = {
    listen: { port: 7654 },
  };

  // 数据库配置
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
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
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  // session配置
  config.session = {
    key: 'PHP_qiju',
    // domain: '.qiju.art',
    maxAge: ms('6h'),
  };

  config.qiju = {
    namespace: '/qiju',
    host: 'https://qiju.art',
    salt: '!^_^~123abC', // 这个 salt 是干啥的
  };

  config.static = {
    prefix: config.qiju.namespace + '/public',
  };

  config.notfound = {
    pageUrl: config.qiju.namespace + '/public/404.html',
  };

  // const apiLevel = config.apiLevel = 'v0';

  // add your config here
  config.middleware = [];

  // config.apiCommon = {
  //   enable: true,
  //   match: `/qiju/${apiLevel}/api`,
  // };

  config.security = {
    csrf: {
      enable: false, // 关掉不解释
    },
    domainWhiteList: [ 'localhost:8080', 'localhost:7654', 'qiju.art' ], // 域名白名单
  };

  config.cors = {
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTION',
    credentials: true,
  };

  // 文件上传设置
  config.multipart = {
    mode: 'file',
    tmpdir: path.join(os.tmpdir(), 'egg-multipart-tmp', appInfo.name),
    cleanSchedule: {
      // run tmpdir clean job on every day 04:30 am
      // cron style see https://github.com/eggjs/egg-schedule#cron-style-scheduling
      cron: '0 30 4 * * *',
    },
  };

  // nginx 设置
  config.proxy = true;

  /**
   * 数据库存储的布尔
   */
  // 不知道有啥用，也许以后有用，就先留着吧
  config.DB_BOOL = Object.freeze({
    TRUE: 1,
    FALSE: 0,
  });

  return config;
};
