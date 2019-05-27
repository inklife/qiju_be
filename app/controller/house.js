'use strict';
const shortid = require('shortid');
const _ = require('loadsh');
const Controller = require('egg').Controller;

class HouseController extends Controller {
  // POST 上传房源信息
  async uploadHouseInfo() {
    const { ctx } = this;
    const {
      region,
      address,
      price,
      pet,
      facility,
      house_image,
      house_rent_staus,
    } = ctx.request.body;
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
  // POST 收藏房源
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
    const {
      house_id,
      region,
      address,
      price,
      pet,
      facility,
      house_image,
      house_rent_staus,
    } = ctx.request.body;
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
    let {
      region,
      address,
      pet,
      facility,
      house_rent_staus,
      page,
      number,
    } = ctx.query;
    if (/\d+/.test(page)) {
      page = Number(page);
    }
    if (!Number.isInteger(page)) {
      page = 1;
      ctx.logger.info('页数为空或不是整数');
    }
    if (!number) {
      number = 6;
    }
    // 日志输出
    ctx.logger.info(ctx.query);
    // TODO 过滤不安全字符
    let sql =
      'select h.*, IFNULL(house_collect_sta.collect_times, 0) as collect_times from  house_info as h ' +
      ' LEFT JOIN  house_collect_sta ON h.house_id = house_collect_sta.house_id where 1=1 ';
    if (region) {
      sql += 'AND region = ' + region + ' ';
    }
    if (address) {
      sql = sql + 'AND address = ' + address + ' ';
    }
    if (pet) {
      sql = sql + 'AND pet = ' + pet + ' ';
    }
    if (facility) {
      sql = sql + 'AND facility = ' + facility + ' ';
    }
    if (house_rent_staus) {
      sql = sql + 'AND house_rent_staus = ' + house_rent_staus + ' ';
    }
    sql += 'ORDER BY collect_times DESC';
    let limit = -1;
    let offset = 0;
    if (page > 0) {
      limit = number > 0 ? number : 0;
      offset = (page - 1) * number;
      sql = sql + ' LIMIT ? OFFSET ?';
    }
    console.log({ sql, limit, offset });
    const resp = await this.service.house.getHouses({ sql, limit, offset });
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
  // keyword 搜索 HouseList
  async searchHouseList() {
    const { ctx } = this;
    let { keyword, page } = ctx.query;
    ctx.logger.info(ctx.query, typeof page);
    if (/\d+/.test(page)) {
      page = Number(page);
    }
    if (!Number.isInteger(page)) {
      page = 1;
      ctx.logger.info('页数为空或不是整数');
    }
    // 日志输出
    const user_id = ctx.session.user_id;
    if (_.isEmpty(keyword) || !/^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(keyword)) {
      ctx.body = { code: -1, message: '关键词包含敏感字符' };
      return;
    }
    // 返回值为 house 列表
    const resp = await this.service.house.searchHouseList(
      keyword,
      page,
      user_id
    );
    if (!resp || !resp.length) {
      ctx.body = {
        code: 1,
        message: '结果为空',
        data: {
          list: [],
          online: !!user_id,
        },
      };
      return;
    }
    ctx.body = {
      code: 1,
      data: {
        list: resp,
        online: !!user_id,
      },
    };
  }
  // 获取最近上新的
  async getRecentHouse() {
    const { ctx } = this;
    const query = ctx.query;
    ctx.logger.info(query);
    const user_id = ctx.session.user_id;
    // 返回最近上新的列表
    const resp = await this.service.house.getRecentHouse(user_id);
    ctx.body = {
      code: 1,
      data: {
        list: resp,
        online: !!user_id,
      },
    };
  }
  // 根据id获取房源
  async profile() {
    const { ctx } = this;
    const { house_id } = ctx.query;
    // 日志输出
    ctx.logger.info(ctx.query);
    const resp = await this.service.house.getHouseByHouserId(house_id);
    if (resp) {
      ctx.body = {
        code: 1,
        data: resp,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: '未找到房源',
    };
  }
  // 获取房源相关信息及联系方式
  async accessOneHouse() {
    const { ctx } = this;
    const { house_id } = ctx.query;
    // 日志输出
    ctx.logger.info(ctx.query);
    const resp = await this.service.house.accessOneHouse(house_id);
    if (resp) {
      ctx.body = {
        code: 1,
        data: resp,
      };
      return;
    }
    ctx.body = {
      code: -1,
      message: '未找到房源',
    };
  }
  // 按 condition 条件 搜索房屋
  async conditionSearch() {
    const { ctx } = this;
    const user_id = ctx.session.user_id;
    ctx.logger.info(ctx.request.body);
    const queryList = [];
    let {
      region,
      address,
      price,
      pet,
      facility,
      // house_rent_staus,
      page,
      number,
    } = ctx.request.body;
    if (/\d+/.test(page)) {
      page = Number(page);
    }
    if (!Number.isInteger(page)) {
      page = 1;
      ctx.logger.info('页数为空或不是整数');
    }
    if (!number) {
      number = 6;
    }
    // 日志输出
    ctx.logger.info(ctx.request.body);
    let sql = 'SELECT * FROM house_info WHERE 1=1';
    if (region) {
      sql += ' AND region=?';
      queryList.push(region);
    }
    if (address) {
      sql += ' AND address=?';
      queryList.push(address);
    }
    if (/^(\+?\d+),([\+\-]?\d+)$/.test(price)) {
      const bounds = price.split(',').map(v => Number(v));
      if (bounds[1] < 1) {
        sql += ' AND price>=?';
        queryList.push(bounds[0]);
      } else {
        sql += ' AND price>=? AND price<?';
        queryList.push(bounds[0], bounds[1]);
      }
    }
    if (pet) {
      sql += ' AND pet=?';
      queryList.push(pet);
    }
    if (facility && facility.length) {
      console.log(facility);
      sql += ' AND  facility like ?';
      queryList.push('%' + facility.join('%') + '%');
    }
    let limit = -1;
    let offset = 0;
    if (page > 0) {
      limit = number > 0 ? number : 0;
      offset = (page - 1) * number;
      sql = sql + ' LIMIT ?,?';
      queryList.push(offset, limit);
    }
    ctx.logger.info(sql, queryList);
    const resp = await this.service.house.conditionSearch({
      sql,
      queryList,
      user_id,
    });
    if (resp) {
      ctx.body = {
        code: 1,
        data: {
          list: resp,
          online: !!user_id,
        },
      };
      return;
    }
    ctx.body = {
      code: 1,
      message: '结果为空',
      data: {
        list: [],
        online: !!user_id,
      },
    };
  }
}

module.exports = HouseController;
