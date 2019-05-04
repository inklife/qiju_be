'use strict';
const shortid = require('shortid');
const Controller = require('egg').Controller;

class HouseController extends Controller {
  // POST 上传房源信息
  async uploadHouseInfo() {
    const { ctx } = this;
    const { region, address, price, pet, facility, house_image, house_rent_staus } = ctx.request.body;
    const user_id = ctx.session.user_id;
    const house_id = shortid.generate();
    // 日志输出
    ctx.logger.info(ctx.request.body);
    // resp 为本次修改数据库影响行数是否为1行 的逻辑值
    const resp = await this.service.house.updateHouseInfo({
      user_id,
      house_id,
      region,
      address,
      price,
      pet,
      facility,
      house_image,
      house_rent_staus,
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
  // POST 提交房源评价
  async editHouseRemark() {
    const { ctx } = this;
    const { house_id, remark_content } = ctx.request.body;
    const user_id = ctx.session.user_id;
    const remark_id = shortid.generate();
    // 日志输出
    ctx.logger.info(ctx.request.body);
    const resp = await this.service.house.updateHouseRemark({
      remark_id,
      user_id,
      house_id,
      remark_content,
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
  // PATCH 收藏房源
  async favouriteHouse() {
    const { ctx } = this;
    const { house_id } = ctx.request.body;
    const user_id = ctx.session.user_id;
    const collect_id = shortid.generate();
    // 日志输出
    ctx.logger.info(ctx.request.body);
    const resp = await this.service.house.updateFavouriteHouse({
      collect_id,
      user_id,
      house_id,
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

module.exports = HouseController;
