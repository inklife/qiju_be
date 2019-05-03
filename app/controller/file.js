'use strict';

// const path = require('path');
const Controller = require('egg').Controller;

class FileController extends Controller {
  async upload() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    // const name = 'qiju/' + path.basename(file.filename);
    // let result;
    try {
      // process file or upload to cloud storage
      // result = await ctx.oss.put(name, file.filepath);
      ctx.logger.info(file.filepath);
    } finally {
      // need to remove the tmp files
      // await ctx.cleanupRequestFiles();
    }

    ctx.body = {
      // url: result.url,
      // TODO remove it
      filepath: file.filepath,
      // get all field values
      requestBody: ctx.request.body,
    };
  }
}

module.exports = FileController;
