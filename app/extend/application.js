/**
 * 说明
 * -------
 * 对 EGG.Application (即 `app` 对象) 的扩展
 * 可以使用 app.cos 对象调用 cos-nodejs-sdk-v5
 * 文档 https://github.com/tencentyun/cos-nodejs-sdk-v5
 * 本文件对 cos-nodejs-sdk-v5 做了二次扩展
 */
'use strict';
const nodemailer = require('nodemailer');
const nodemailer_API = Symbol('Application#nodemailer_API');

// app/extend/application.js
const util = require('util');
const COS_NODEJS_SDK = require('cos-nodejs-sdk-v5');

class COS_V0 extends COS_NODEJS_SDK {
  constructor(options) {
    super(options);
    this.Bucket = options.Bucket || '';
    this.Region = options.Region || '';
  }
  /**
   * 上传本地文件到COS文件储存桶
   * @param {String} Key 设定上传到cos的路径
   * @param {String} FilePath 本地需要上传的文件
   * @param {Object} options 设定Bucket存储桶和Region区域的选项
   * @return {Promise<Object>} Promise包裹的data，格式见文件末尾
   */
  put(Key, FilePath, options = {}) {
    const Bucket = options.Bucket || this.Bucket;
    const Region = options.Region || this.Region;
    const sliceUploadFile = util.promisify(super.sliceUploadFile).bind(this);
    return sliceUploadFile({ Bucket, Region, Key, FilePath });
  }
}

const COS_API = Symbol('Application#COS_API');

module.exports = {
  get cos() {
    // this 就是 app 对象，在其中可以调用 app 上的其他方法，或访问属性
    if (!this[COS_API]) {
      const api = new COS_V0(this.config.cos);
      this[COS_API] = api;
    }
    return this[COS_API];
  },
  get email() {
    if (!this[nodemailer_API]) {
      const api = nodemailer.createTransport(this.config.email);
      this[nodemailer_API] = api;
    }
    return this[nodemailer_API];
  },
};

/*

Promise 返回的 data 格式如下

{
  Location:
    'qiju-000.cos.ap-chongqing.myqcloud.com/qiju/000.jpg',
  Bucket: 'qiju',
  Key: 'qiju/000.jpg',
  ETag: '"f8511565c732363c03ad1869095a9950-1"',
  statusCode: 200,
  headers: {
    'content-type': 'application/xml',
    'transfer-encoding': 'chunked',
    connection: 'keep-alive',
    date: 'Sat, 01 May 2019 16:53:39 GMT',
    server: 'tencent-cos',
    'x-cos-request-id': 'NWNjZGMzOTNfMjAyMjYyNjRfN2FhZV8jMTViMGM=',
  },
};

*/
