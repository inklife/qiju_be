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
  // 用户鉴权中间件
  const auth = app.middleware.auth();
  // 图形验证码鉴权中间件
  const captcha = app.middleware.captcha();
  // 用户登录与注册
  qiju.get('/', controller.home.index);
  qiju.post('/user/login', controller.user.login);
  // 登出
  qiju.get('/user/logout', controller.user.logout);
  // 判断用户是否在线
  qiju.get('/user/online', auth, controller.user.online);
  // 注册
  qiju.post('/user/register', controller.user.register);
  // 获取用户信息
  qiju.get('/user/profile', auth, controller.user.getUserInfo);
  // 更新用户个人信息
  qiju.post('/user/user_page', auth, controller.user.updateUserPage);
  // 文件上传
  qiju.post('/file/upload', controller.file.upload);
  // 新增一个房子 新增一条房屋信息
  qiju.post('/house/create', auth, controller.house.uploadHouseInfo);
  // 提交房源评价
  qiju.post('/house/remarkCreate', auth, controller.house.createHouseRemark);
  // 收藏房源
  qiju.post('/user/collectHouse', auth, controller.house.favouriteHouse);
  // 获取我创建的房源
  qiju.get('/user/getAllMyHouse', auth, controller.house.getAllMyHouse);
  // 获取我收藏的房源
  qiju.get(
    '/user/getAllMyCollectHouse',
    auth,
    controller.house.getAllMyCollectHouse
  );
  // 获取的本人发布的闲置物品
  qiju.get('/user/getAllMyIdleItem', auth, controller.item.getAllMyIdleItem);
  // 获取的本人收藏的闲置物品
  qiju.get(
    '/user/getAllMyCollectIdleItem',
    auth,
    controller.item.getAllMyCollectIdleItem
  );
  // // 根据闲置物品id获得 所属这
  // qiju.get('/user/getAllMyIdleItem', auth, controller.item.getAllMyIdleItem);

  // 根据house_id获取房源信息
  qiju.get('/house/profile', auth, controller.house.profile);

  // 获得房源信息及联系方式
  qiju.get('/house/access', auth, controller.house.accessOneHouse);

  // 上传闲置物品信息
  qiju.post('/user/itemEdit', auth, controller.item.uploadItemInfo);
  // 收藏闲置物品
  qiju.post('/user/collectItem', auth, controller.item.favouriteItem);
  // 分页获取所有闲置物品
  qiju.get('/item/getAll', auth, controller.item.getAll);

  // 检查房源是否存在
  qiju.get('/house/checkHouseid', controller.house.checkHouse);
  // 更新房源信息
  qiju.post('/house/houseUpdate', auth, controller.house.updateHouseInfo);
  // 获取房源按收藏数排序
  qiju.get(
    '/house/markedRank',
    // auth,
    controller.house.getHousesByCollectNumber
  );
  // 更新房源评论
  qiju.post('/house/remarkUpdate', auth, controller.house.updateHouseRemark);
  // 拉取评价
  qiju.get('/house/remarks', auth, controller.house.getHouseRemarks);
  // 删除房屋信息
  qiju.delete('/house/houseDelete', auth, controller.house.deleteHouse);
  // 判断房屋rent状态
  qiju.get('/house/houseRent', auth, controller.house.getHouseRentStatus);
  // 根据 item_id 返回闲置物品
  qiju.get('/item/profile', auth, controller.item.profile);
  // 更新闲置物品信息
  qiju.post('/item/itemUpdate', auth, controller.item.updateItemInfo);
  // 按 keyword 获得房屋信息
  qiju.get('/house/houseSearch', controller.house.searchHouseList);
  // 按 condition 搜索房屋
  qiju.post('/house/conditionSearch', controller.house.conditionSearch);

  // 按 keyword 搜索物品
  qiju.get('/house/itemSearch', auth, controller.item.searchItemList);
  // 获取物品按收藏数排序
  qiju.get(
    '/item/itemSortByCollect',
    auth,
    controller.item.getItemsByCollectNumber
  );
  // 判断闲置物品是否出售
  qiju.get('/item/hasSold', auth, controller.item.itemHasSold);
  // 删除闲置物品
  qiju.get('/item/deleteItem', auth, controller.item.deleteItem);
  // 发送邮件验证码
  qiju.post(
    '/email/sendvercode',
    captcha,
    controller.email.SendVerificationCode
  );
  // 生成前端图片验证码
  qiju.get('/security/captcha', controller.security.captcha);
  // 最近上新
  qiju.get('/house/recent', controller.house.getRecentHouse);
  // 重置密码
  qiju.post('/user/resetpwd', controller.user.resetPassword);
};
