'use strict';
const shortid = require('shortid');
const _ = require('loadsh');
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
  // GET 检查闲置物品是否存在
  async checkItem() {
    const { ctx } = this;
    const { item_id } = ctx.query;
    // 日志输出
    ctx.logger.info(ctx.query);
    // resp 为本次修改数据库影响行数是否为1行 的逻辑值
    const resp = await this.service.item.getItemByItemId(item_id);
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
  // POST 更新闲置物品信息
  async updateItemInfo() {
    const { ctx } = this;
    const { item_id, type, price, item_image, status, used_time, price_discuss, description, title } = ctx.request.body;
    const user_id = ctx.session.user_id;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    if (item_id) {
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
    }
    ctx.body = {
      code: -1,
    };
  }
  // keyword 搜索 闲置物品
  async searchItemList() {
    const { ctx } = this;
    const keyword = ctx.query.keyword;
    // 日志输出
    ctx.logger.info(ctx.query);
    if (_.isEmpty(keyword) || !(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(keyword))) {
      ctx.body = { code: -1 };
      return;
    }
    // 返回值为 house 列表
    const resp = await this.service.item.searchItemList(keyword);
    if (!resp || !resp.length) {
      ctx.body = {
        code: -1,
        data: {
          list: [],
        },
      };
      return;
    }
    ctx.body = {
      code: 1,
      data: {
        list: resp,
      },
    };
  }
  // 获取物品按收藏数排序
  async getHousesByCollectNumber() {
    const { ctx } = this;
    const { page, number } = ctx.request.body;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    let sql = `SELECT
    *,
    IFNULL( t_collect_count, 0 ) AS collect_count 
  FROM
    item_info AS item
    LEFT JOIN ( SELECT c.item_id, COUNT( * ) t_collect_count FROM item_collect AS c GROUP BY c.item_id ) t ON item.item_id = t.item_id 
  ORDER BY
    collect_count DESC`;
    let limit = -1;
    let offset = 0;
    if (page > 0) {
      limit = number > 0 ? number : 0;
      offset = (page - 1) * number;
      sql = sql + ' LIMIT ?,?';
    }
    const resp = await this.service.item.getItems({ sql, limit, offset });
    if (resp) {
      ctx.body = {
        code: 1,
        data: {
          list: resp,
        },
      };
      return;
    }
    ctx.body = {
      code: -1,
    };
  }
}

module.exports = ItemController;
