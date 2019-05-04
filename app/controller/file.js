'use strict';

const path = require('path');
const Controller = require('egg').Controller;

class FileController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    const name =
      'qiju/' +
      ctx.helper.generateYYMMDD() +
      ctx.helper.random(6) +
      path.basename(file.filename);
    ctx.logger.info(name);
    // eslint-disable-next-line no-unused-vars
    let result;
    try {
      // process file or upload to cloud storage
      result = await ctx.cos.put(name, file.filepath);
    } finally {
      // need to remove the tmp files
      await ctx.cleanupRequestFiles();
    }

    ctx.body = {
      url: `https://${result.Location}`,
      // get all field values
      requestBody: ctx.request.body,
    };
  }
}

module.exports = FileController;
