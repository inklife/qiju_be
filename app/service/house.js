'use strict';

const Service = require('egg').Service;

class HouseService extends Service {
  // 添加/更新房源信息
  async updateHouseInfo(options) {
    const house = await this.app.mysql.get('house_info', { house_id: options.house_id });
    if (house) {
      return await this.app.mysql.update('house_info', options, {
        where: {
          house_id: options.house_id,
        },
      });
    }
    return await this.app.mysql.insert('house_info', options);
  }
  // 添加/更新房源评论
  async updateHouseRemark(options) {
    if (options.remark_id) {
      const remark = await this.app.mysql.get('house_remark', { remark_id: options.remark_id });
      if (remark) {
        return await this.app.mysql.update('house_remark', options, {
          where: {
            remark_id: options.remark_id,
          },
        });
      }
    }
    return await this.app.mysql.insert('house_remark', options);
  }
  // 添加/更新收藏房源
  async updateFavouriteHouse(options) {
    if (options.collect_id) {
      const collect = await this.app.mysql.get('house_collect', { collect_id: options.collect_id });
      if (collect) {
        return await this.app.mysql.delete('house_collect', { collect_id: options.collect_id });
      }
    }
    return await this.app.mysql.insert('house_collect', options);
  }
}

module.exports = HouseService;
