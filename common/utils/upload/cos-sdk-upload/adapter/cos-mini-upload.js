import { getCosTmpKey, updateAttachment } from '@common/server';
import time from '@discuzq/sdk/dist/time';
var COS = require('cos-wx-sdk-v5');

export default (options) => {
  return new Promise(async (resolve, reject) => {
    const {
      file,
      type,
      qcloudCos,
      qcloudCosBucketName: Bucket,
      qcloudCosBucketArea: Region,
      qcloudCosSignUrl: isOpenSign,
    } = options;

    if (!qcloudCos || typeof file === 'string') {
      reject('error');
      return;
    }

    debugger;
    const filePath = file.path;
    const filename = filePath.substr(filePath.lastIndexOf('/') + 1);
    const fileSize = file.size;
    const path = `public/attachments/${time.formatDate(new Date(), 'YYYY/MM/DD')}/`;

    // 初始化cos实例
    const cos = new COS({
      getAuthorization: async (_options, callback) => {
        const res = await getCosTmpKey({
          type,
          fileSize,
          fileName: filename,
        });
        const { code, data } = res;
        if (code === 0) {
          const credentials = data && data.credentials;
          callback({
            TmpSecretId: credentials.tmpSecretId,
            TmpSecretKey: credentials.tmpSecretKey,
            SecurityToken: credentials.sessionToken,
            StartTime: data.startTime,
            ExpiredTime: data.expiredTime,
          });
        } else {
          // todo: 处理异常情况，获取临时密钥失败
          reject('error');
        }
      }
    });

    cos.postObject({
      Bucket,
      Region,
      Key: path + filename,
      FilePath: filePath,
      onProgress: function (info) {
          console.log(JSON.stringify(info));
      }
    }, function (err, data) {
      if (err === null) {
        cos.getObjectUrl({
          Bucket: Bucket,
          Region: Region,
          Key: path + filename,
          Sign: isOpenSign,
        }, async (err, data) => {
          if (err === null) {
            const { Url: cosUrl } = data;
            const res = await updateAttachment({
              type,
              cosUrl,
              filename,
            });
            resolve(res);
          } else if (err) {
            debugger;
            // todo: 异常情况处理，上传失败
            reject(err);
          }
        });
      } else if (err) {
        debugger;
        // todo: 异常情况处理，上传失败
        reject(err);
      }
    });

  });
};
