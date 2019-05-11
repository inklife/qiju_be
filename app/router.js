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
  // 上传房源信息
  qiju.post('/user/houseEdit', auth, controller.house.uploadHouseInfo);
  // 提交房源评价
  qiju.post('/user/remarkEdit', auth, controller.house.editHouseRemark);
  // 收藏房源
  qiju.post('/user/collectHouse', auth, controller.house.favouriteHouse);
  // 上传闲置物品信息
  qiju.post('/user/itemEdit', auth, controller.item.uploadItemInfo);
  // 收藏闲置物品
  qiju.post('/user/collectItem', auth, controller.item.favouriteItem);
  // 检查房源是否存在
  qiju.get('/user/checkHouseid', controller.house.checkHouse);
  // 更新房源信息
  qiju.post('/house/houseUpdate', auth, controller.house.updateHouseInfo);
  // 获取房源按收藏数排序
  qiju.post('/house/markedRank', auth, controller.house.getHousesByCollectNumber);
  // 更新房源评论
  qiju.post('/house/remarkUpdate', auth, controller.house.updateHouseRemark);
  // 删除房屋信息
  qiju.delete('/house/houseDelete', auth, controller.house.deleteHouse);
  // 判断房屋rent状态
  qiju.get('/house/houseRent', auth, controller.house.getHouseRentStatus);
  // 检查闲置物品是否存在
  qiju.get('/house/itemCheck', auth, controller.item.checkItem);
  // 更新闲置物品信息
  qiju.post('/user/itemUpdate', auth, controller.item.updateItemInfo);
  // 按 keyword 获得房屋信息
  qiju.get('/house/houseSearch', auth, controller.house.searchHouseList);
  // 按 keyword 搜索物品
  qiju.get('/house/itemSearch', auth, controller.item.searchItemList);
  // 获取物品按收藏数排序
  qiju.get('/item/itemSortByCollect', auth, controller.item.getHousesByCollectNumber);
};
