'use strict';

const Service = require('egg').Service;

class ItemService extends Service {
  async updateItemInfo(options) {
    const item = await this.app.mysql.get('item_info', {
      item_id: options.item_id,
    });
    if (item) {
      return await this.app.mysql.update('item_info', options, {
        where: {
          item_id: options.item_id,
        },
      });
    }
    return await this.app.mysql.insert('item_info', options);
  }
  // 切换闲置物品收藏状态
  async updateFavouriteItem(options) {
    const item = await this.app.mysql.get('item_collect', {
      user_id: options.user_id,
      item_id: options.item_id,
    });
    if (item) {
      return await this.app.mysql.delete('item_collect', {
        collect_id: item.collect_id,
      });
    }
    return await this.app.mysql.insert('item_collect', options);
  }
  async getItemByItemId(item_id) {
    return await this.app.mysql.get('item_info', { item_id });
  }
  async searchItemList(keyword) {
    return await this.app.mysql.query(
      'select * from `item_info` where `type` REGEXP ? OR `title` REGEXP ? OR `description` REGEXP ? limit 100',
      [ keyword, keyword, keyword ]
    );
  }
  async getItems(options) {
    if (options.limit === -1) {
      return await this.app.mysql.query(options.sql);
    }
    return await this.app.mysql.query(options.sql, [
      options.offset,
      options.limit,
    ]);
  }
  async getItemStatus(item_id) {
    return await this.app.mysql.get('item_info', { item_id });
  }
  async deleteItem(item_id) {
    return await this.app.mysql.delete('item_info', { item_id });
  }
  // 获取我发布的闲置物品
  async getAllMyIdleItem(user_id) {
    const itemList = await this.app.mysql.query(
      'select item_info.*,wechat,phone,qq from item_info left join user_info' +
        ' on item_info.user_id=user_info.user_id where item_info.user_id=?',
      user_id
    );
    return itemList;
  }
  // 获取我发布的闲置物品
  async getAllMyCollectIdleItem(user_id) {
    const itemList = await this.app.mysql.query(
      'select item_info.*,wechat,phone,qq from item_collect inner join item_info' +
        ' on item_collect.item_id=item_info.item_id left join user_info' +
        ' on item_info.user_id=user_info.user_id where item_collect.user_id=?',
      user_id
    );
    return itemList;
  }
  // 分页获取所有闲置物品
  // eslint-disable-next-line no-unused-vars
  async getAll(type, page, user_id) {
    const offset = 6 * (page - 1);
    let itemList;
    if (user_id) {
      // TODO 记笔记
      itemList = await this.app.mysql.query(
        'select ii.*,wechat,qq,phone,IFNULL(item_collect_status,0) as item_collect_status from' +
          ' (select * from item_info where `type`=? ORDER BY create_time DESC limit 6 offset ?) as ii' +
          ' LEFT JOIN user_info on ii.user_id=user_info.user_id LEFT JOIN item_collect' +
          ' on ii.item_id=item_collect.item_id AND item_collect.user_id=?;',
        [ type, offset, user_id ]
      );
    } else {
      itemList = await this.app.mysql.query(
        'select ii.*,wechat,qq,phone from' +
          ' (select * from item_info where `type`=? ORDER BY create_time DESC limit 6 offset ?) as ii' +
          ' LEFT JOIN user_info on ii.user_id=user_info.user_id;',
        [ type, offset ]
      );
    }
    return itemList;
  }
}

module.exports = ItemService;
