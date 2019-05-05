'use strict';
const shortid = require('shortid');
const Controller = require('egg').Controller;

class ItemController extends Controller {
  // POST 上传闲置物品信息
  async uploadItemInfo() {
    const { ctx } = this;
    const { type, price, item_image, status, used_time, price_discuss, description, title } = ctx.request.body;
    const user_id = ctx.session.user_id;
    const item_id = shortid.generate();
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // resp 为本次修改数据库影响行数是否为1行 的逻辑值
    const resp = await this.service.item.updateItemInfo({
      user_id,
      item_id,
      type,
      price,
      item_image,
      status,
      used_time,
      price_discuss,
      description,
      title,
    });
    if (resp) {
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = {
      code: -1,
    };
  }
  async favouriteItem() {
    const { ctx } = this;
    const { item_id } = ctx.request.body;
    const user_id = ctx.session.user_id;
    const colloect_id = shortid.generate();
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // resp 为本次修改数据库影响行数是否为1行 的逻辑值
    const resp = await this.service.item.updateFavouriteItem({
      user_id,
      item_id,
      colloect_id,
    });
    if (resp) {
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = {
      code: -1,
    };
  }
}

module.exports = ItemController;
