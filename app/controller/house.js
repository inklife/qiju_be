'use strict';
const shortid = require('shortid');
const _ = require('loadsh');
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
  // GET 检查房源是否存在
  async checkHouse() {
    const { ctx } = this;
    const { house_id } = ctx.query;
    // 日志输出
    ctx.logger.info(ctx.query);
    const resp = await this.service.house.getHouseByHouserId(house_id);
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
  // POST 更改房源信息
  async updateHouseInfo() {
    const { ctx } = this;
    const { house_id, region, address, price, pet, facility, house_image, house_rent_staus } = ctx.request.body;
    const user_id = ctx.session.user_id;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    if (house_id) {
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
    }
    ctx.body = {
      code: -1,
    };
  }
  // 获取房源按收藏数排序
  async getHousesByCollectNumber() {
    const { ctx } = this;
    const { region, address, price, pet, facility, house_rent_staus, page, number } = ctx.request.body;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    let sql = `SELECT
    *,
    IFNULL( t_collect_count, 0 ) AS collect_count 
  FROM
    (
    SELECT
      h.house_id,
      h.user_id,
      h.region,
      h.address,
      h.price,
      h.pet,
      h.facility,
      h.house_image,
      h.house_rent_staus 
    FROM
      house_info AS h 
    WHERE
      !ISNULL(h.house_id)`;
    if (region) {
      sql = sql + 'AND h.region = ' + region + ' ';
    }
    if (address) {
      sql = sql + 'AND h.address = ' + address + ' ';
    }
    if (price) {
      sql = sql + 'AND h.price = ' + price + ' ';
    }
    if (pet) {
      sql = sql + 'AND h.pet = ' + pet + ' ';
    }
    if (facility) {
      sql = sql + 'AND h.facility = ' + facility + ' ';
    }
    if (house_rent_staus) {
      sql = sql + 'AND h.house_rent_staus = ' + house_rent_staus + ' ';
    }
    sql = sql + ') AS h LEFT JOIN ( SELECT c.house_id, COUNT( * ) t_collect_count FROM house_collect AS c GROUP BY c.house_id ) t ON h.house_id = t.house_id ORDER BY collect_count DESC';
    let limit = -1;
    let offset = 0;
    if (page > 0) {
      limit = number > 0 ? number : 0;
      offset = (page - 1) * number;
      sql = sql + ' LIMIT ' + offset + ',' + limit;
    }
    const resp = await this.service.house.getHouses({ sql, limit, offset });
    if (resp) {
      ctx.body = {
        code: 1,
        data: resp,
      };
      return;
    }
    ctx.body = {
      code: -1,
    };
  }
  // POST 更新房源评价
  async updateHouseRemark() {
    const { ctx } = this;
    const { house_id, remark_id, remark_content } = ctx.request.body;
    const user_id = ctx.session.user_id;
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
  // DELETE
  async deleteHouse() {
    const { ctx } = this;
    const { house_id } = ctx.request.body;
    const user_id = ctx.session.user_id;
    // 日志输出
    ctx.logger.info(ctx.request.body);
    const resp = await this.service.house.deleteHouse({
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
  // GET 判断房屋rent状态
  async getHouseRentStatus() {
    const { ctx } = this;
    const { house_id } = ctx.query;
    // 日志输出
    ctx.logger.info(ctx.query);
    const resp = await this.service.house.getHouseRentStatus(house_id);
    if (resp.house_rent_status === 1) {
      ctx.body = {
        code: 1,
      };
      return;
    }
    ctx.body = {
      code: -1,
    };
  }
  // keyword 搜素 HouseList
  async searchHouseList() {
    const { ctx } = this;
    const keyword = ctx.query.keyword;
    // 日志输出
    ctx.logger.info(ctx.query);
    if (_.isEmpty(keyword) || !(/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(keyword))) {
      ctx.body = { code: -1 };
      return;
    }
    // 返回值为 house 列表
    const resp = await this.service.house.searchHouseList(keyword);
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
}

module.exports = HouseController;
