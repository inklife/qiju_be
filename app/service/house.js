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
    const house = await this.app.mysql.get('house_info', { house_id });
    if (typeof house.house_image === 'string') {
      house.house_image = house.house_image.split('|');
    }
    return house;
  }
  async getHouses(options) {
    let houseList;
    if (options.limit === -1) {
      houseList = await this.app.mysql.query(options.sql);
    }
    houseList = await this.app.mysql.query(options.sql, [
      options.limit,
      options.offset,
    ]);
    if (houseList) {
      houseList.forEach(house => {
        if (typeof house.house_image === 'string') {
          house.house_image = house.house_image.split('|');
        }
      });
    }
    return houseList;
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
  async searchHouseList(keyword, page, user_id) {
    const offset = 6 * (page - 1);
    let houseList;
    if (user_id) {
      houseList = await this.app.mysql.query(
        'select h.*, house_collect.house_collect_status, house_collect_sta.collect_times from' +
          ' (select * from `house_info` where `address` REGEXP ? OR `facility` REGEXP ? limit 6 offset ?)' +
          ' as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id' +
          ' LEFT JOIN house_collect on h.house_id=house_collect.house_id AND house_collect.user_id=?;',
        [ keyword, keyword, offset, user_id ]
      );
    } else {
      houseList = await this.app.mysql.query(
        'select h.*, house_collect_sta.collect_times from' +
          ' (select * from `house_info` where `address` REGEXP ? OR `facility` REGEXP ? limit 6 offset ?)' +
          ' as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id;',
        [ keyword, keyword, offset ]
      );
    }
    if (houseList) {
      houseList.forEach(house => {
        if (typeof house.house_image === 'string') {
          house.house_image = house.house_image.split('|');
        }
      });
    }
    return houseList;
  }
  // 获取最近上新
  async getRecentHouse(user_id) {
    if (user_id) {
      const houseList = await this.app.mysql.query(
        // 'select h.*, house_collect.house_collect_status, IFNULL(house_collect_sta.collect_times, 0)' +
        //   ' as collect_number from (select * from house_info ORDER BY house_info.create_time DESC LIMIT 6)' +
        'select h.*, house_collect.house_collect_status, house_collect_sta.collect_times from' +
          ' (select * from house_info where house_rent_status=1 ORDER BY create_time DESC LIMIT 6)' +
          ' as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id' +
          ' LEFT JOIN house_collect on h.house_id=house_collect.house_id AND house_collect.user_id=?;',
        [ user_id ]
      );
      if (houseList) {
        houseList.forEach(house => {
          if (typeof house.house_image === 'string') {
            house.house_image = house.house_image.split('|');
          }
        });
      }
      return houseList;
    }
    const houseList = await this.app.mysql.query(
      'select h.*, house_collect_sta.collect_times from' +
        ' (select * from house_info where house_rent_status=1 ORDER BY create_time DESC LIMIT 6)' +
        ' as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id;'
    );
    if (houseList) {
      houseList.forEach(house => {
        if (typeof house.house_image === 'string') {
          house.house_image = house.house_image.split('|');
        }
      });
    }
    return houseList;
  }
  // 根据house_id获取某一房源相关信息及联系方式
  async accessOneHouse(house_id, user_id) {
    let house;
    // 这里联表没查出来，不晓得是哪里有问题
    // if (user_id) {
    //   house = await this.app.mysql.query(
    //     'select h.*,phone,wechat,qq, IFNULL(house_collect_status,0) as house_collect_status' +
    //     ' from house_info h LEFT JOIN user_info ON h.user_id=user_info.user_id' + // 获得房屋主人信息
    //     ' LEFT JOIN house_collect ON h.house_id=house_collect.house_id' + // 获得在线用户收藏信息
    //       ' WHERE h.house_id=? AND house_collect.user_id=?',
    //     [ house_id, user_id ]
    //   );
    // } else {
    house = await this.app.mysql.query(
      'select h.*,phone,wechat,qq from house_info h' +
        ' LEFT JOIN user_info ON h.user_id=user_info.user_id where h.house_id=?;',
      house_id
    );
    // }
    if (house.length) {
      house = house[0];
      if (user_id) {
        const house_collect_info = await this.app.mysql.get('house_collect', {
          house_id,
          user_id,
        });
        if (house_collect_info) {
          house.house_collect_status = house_collect_info.house_collect_status;
        }
      }
    }
    if (typeof house.house_image === 'string') {
      house.house_image = house.house_image.split('|');
    }
    return house;
  }
  // 条件搜索房源
  async conditionSearch({ sql, queryList, user_id }) {
    let houseList;
    if (user_id) {
      houseList = await this.app.mysql.query(
        'select h.*, house_collect.house_collect_status, house_collect_sta.collect_times from (' +
          sql +
          ') as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id' +
          ' LEFT JOIN house_collect on h.house_id=house_collect.house_id AND house_collect.user_id=?;',
        [ ...queryList, user_id ]
      );
    } else {
      houseList = await this.app.mysql.query(
        'select h.*, house_collect_sta.collect_times from (' +
          sql +
          ') as h LEFT JOIN house_collect_sta on h.house_id=house_collect_sta.house_id;',
        queryList
      );
    }
    if (houseList) {
      houseList.forEach(house => {
        if (typeof house.house_image === 'string') {
          house.house_image = house.house_image.split('|');
        }
      });
    }
    return houseList;
  }
  // 拉取房源评价
  async getHouseRemarks(house_id) {
    return await this.app.mysql.query(
      'select house_remark.remark_content,user_info.user_name from house_remark' +
        ' left join user_info on house_remark.user_id=user_info.user_id' +
        ' where house_remark.house_id=? ORDER BY house_remark.create_time DESC',
      house_id
    );
  }
}

module.exports = HouseService;
