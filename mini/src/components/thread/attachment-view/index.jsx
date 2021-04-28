import React from 'react';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { extensionList, noop } from '../utils';
import { View, Text } from '@tarojs/components';

/**
 * 附件
 * @prop {Array} attachments 附件数组
 * @prop {Boolean} isHidden 是否隐藏删除按钮
 */

const Index = ({ attachments = [], isHidden = true, isPay = false, onClick = noop }) => {
  // 处理文件大小的显示
  const handleFileSize = (fileSize) => {
    if (fileSize > 1000000) {
      return `${(fileSize / 1000000).toFixed(2)} M`;
    }
    if (fileSize > 1000) {
      return `${(fileSize / 1000).toFixed(2)} KB`;
    }

    return `${fileSize} B`;
  };
  return (
    <View>
        {
          attachments.map((item, index) => {
            // 获取文件类型
            const extension = item.fileName.split('.')[item.fileName.split('.').length - 1];
            const type = extensionList.indexOf(extension.toUpperCase()) > 0
              ? extension.toUpperCase()
              : 'UNKNOWN';
            return (
              <View className={styles.container} key={index} onClick={onClick} >
                <View>
                  {/* TODO 此处逻辑接口确定之后再改 */}
                  <Icon name={type && 'PaperClipOutlined'} />
                  <Text className={styles.content}>{item.fileName}</Text>
                  <Text className={styles.size}>{handleFileSize(parseFloat(item.fileSize || 0))}</Text>
                </View>

                {!isHidden && <Icon name="CloseOutlined" />}

                {!isPay && <a href={item.url} className={styles.a}></a>}
              </View>
            );
          })
        }
    </View>
  );
};

export default React.memo(Index);