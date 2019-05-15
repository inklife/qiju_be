'use strict';

// config/plugin.js
module.exports = {
  // 开启插件
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  redis: {
    enable: true,
    package: 'egg-redis',
  },
  sessionRedis: {
    enable: true,
    package: 'egg-session-redis',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
  tracer: {
    enable: true,
    package: 'egg-tracer',
  },
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  routerPlus: {
    enable: true,
    package: 'egg-router-plus',
  },
  // {app_root}/config/plugin.js
  cos: {
    enable: true,
    package: '@shuang6/egg-cos',
  },
  // multipart: {
  //   enable: true,
  //   package: 'egg-multipart',
  // },
  // nunjucks: true,
};
