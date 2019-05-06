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
}

module.exports = ItemService;
