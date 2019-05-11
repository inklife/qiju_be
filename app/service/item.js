'use strict';

const Service = require('egg').Service;

class ItemService extends Service {
  async updateItemInfo(options) {
    const item = await this.app.mysql.get('item_info', { item_id: options.item_id });
    if (item) {
      return await this.app.mysql.update('item_info', options, {
        where: {
          item_id: options.item_id,
        },
      });
    }
    return await this.app.mysql.insert('item_info', options);
  }
  async updateFavouriteItem(options) {
    const item = await this.app.mysql.get('item_collect', { collect_id: options.collect_id });
    if (item) {
      return await this.app.mysql.update('item_collect', options, {
        where: {
          collect_id: options.collect_id,
        },
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
}

module.exports = ItemService;
