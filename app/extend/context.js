'use strict';

module.exports = {
  get cos() {
    // cos配置
    const config = this.app.config.cos.client;
    return new Proxy(this.app.cos, {
      get(obj, key) {
        // 添加 ctx.cos.put 便捷方法
        if (key === 'put') {
          /**
           * 上传本地文件到COS文件储存桶
           * @param {String} cos_path 设定上传到cos的路径
           * @param {String} local_path 本地需要上传的文件
           * @return {Promise<Object>} Promise包裹的data，格式见文件末尾
           */
          return function(cos_path, local_path) {
            return new Promise((reslove, reject) => {
              // 分片上传
              obj.sliceUploadFile(
                {
                  Bucket: config.bucket, // Bucket 格式：test-1250000000
                  Region: config.region,
                  Key: cos_path, // 设置上传到cos后的文件的名称
                  FilePath: local_path, // 设置要上传的本地文件
                },
                function(err, data) {
                  if (err) {
                    reject(JSON.stringify(err));
                  } else {
                    reslove(data);
                  }
                }
              );
            });
          };
        }
        return obj[key];
      },
    });
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
