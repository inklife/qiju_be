'use strict';

const Service = require('egg').Service;

class HouseService extends Service {
  // 添加/更新房源信息
  async updateHouseInfo(options) {
    const house = await this.app.mysql.get('house_info', {
      house_id: options.house_id,
    });
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
      const remark = await this.app.mysql.get('house_remark', {
        remark_id: options.remark_id,
      });
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
  // 收藏/取消收藏 房源
  async updateFavouriteHouse(options) {
    const { ctx, app } = this;
    if (options.collect_id) {
      const collect = await this.app.mysql.get('house_collect', {
        user_id: options.user_id,
        house_id: options.house_id,
      });
      // 如果已收藏，走取消收藏的逻辑
      if (collect) {
        // eslint-disable-next-line no-unused-vars
        return await app.mysql.beginTransactionScope(async conn => {
          await app.mysql.delete('house_collect', {
            collect_id: collect.collect_id,
          });
          const house_sta = await app.mysql.get('house_collect_sta', {
            house_id: options.house_id,
          });
          if (house_sta) {
            // 收藏次数 -1
            await app.mysql.query(
              'update house_collect_sta set collect_times=collect_times-1 where house_id=?;',
              options.house_id
            );
          }
          return { success: true };
        }, ctx);
      }
      // 如果未收藏，走收藏的逻辑
      // eslint-disable-next-line no-unused-vars
      return await app.mysql.beginTransactionScope(async conn => {
        await app.mysql.insert('house_collect', {
          ...options,
          house_collect_status: 1,
        });
        // 收藏次数 +1
        await app.mysql.query(
          'INSERT INTO house_collect_sta(house_id,collect_times) VALUES (?,1)' +
            ' ON DUPLICATE KEY UPDATE collect_times=collect_times+1;',
          options.house_id
        );
        return { success: true };
      }, ctx);
    }
  }
  // 通过house_id获取房屋信息
  async getHouseByHouserId(house_id) {
    return await this.app.mysql.get('house_info', { house_id });
  }
  async getHouses(options) {
    if (options.limit === -1) {
      return await this.app.mysql.query(options.sql);
    }
    return await this.app.mysql.query(options.sql, [
      options.offset,
      options.limit,
    ]);
  }
  async deleteHouse(options) {
    await this.app.mysql.delete('house_info', { house_id: options.house_id });
    await this.app.mysql.delete('house_remark', { house_id: options.house_id });
    await this.app.mysql.delete('house_collect', {
      house_id: options.house_id,
    });
  }
  async getHouseRentStatus(house_id) {
    return await this.app.mysql.get('house_info', { house_id });
  }
  // 获取keyword搜素列表
  async searchHouseList(keyword) {
    // TODO REMOVE `select *`
    // 注意：
    // 使用用户的输入作为sql语句混入时必须保证过滤不安全字符
    // 前置 controller 已过滤
    return await this.app.mysql.query(
      'select * from `house_info` where `address` REGEXP ? OR `facility` REGEXP ? limit 100',
      [ keyword, keyword ]
    );
  }

  async getRecentHouse(user_id) {
    if (user_id) {
      return await this.app.mysql.query(
        'select h.*, house_collect.house_collect_status from house_info as h left join' +
          ' house_collect on h.house_id=house_collect.house_id AND house_collect.user_id=?' +
          '  ORDER BY h.create_time DESC LIMIT 6',
        [ user_id ]
      );
    }
    return await this.app.mysql.query(
      'select * from house_info as h ORDER BY h.create_time DESC LIMIT 6'
    );
  }
}

module.exports = HouseService;
