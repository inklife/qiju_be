'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { controller, config } = app;
  const qiju = app.router.namespace(config.qiju.namespace);

  // const auth = app.middleware.auth({
  //   prefix: config.qiju.host + `/qiju/${config.apiLevel}/api/auth?redirect=`,
  //   whiteList: new Set([ '' ]),
  //   config,
  // });
  const auth = app.middleware.auth();
  // 用户登录与注册
  qiju.get('/', controller.home.index);
  qiju.post('/user/login', controller.user.login);
  qiju.post('/user/register', controller.user.register);
  // 更新用户个人信息
  qiju.post('/user/user_page', auth, controller.user.updateUserPage);
  // 文件上传
  qiju.post('/file/upload', controller.file.upload);
};
