
import React from 'react';
import Popup from '@discuzq/design/dist/components/popup/index';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const deletePop = (props) => {
  const { visible, onClose, onBtnClick } = props;

  return (
    <Popup
      position="center"
      visible={visible}
      onClose={onClose}
    >
      <View className={styles.container}>
        <View className={styles.deleteTips}>
          <View className={styles.tips}>提示</View>
          <View className={styles.content}>确定删除这篇内容吗？</View>
        </View>
        <View className={styles.btn}>
          <View className={styles.close} onClick={onClose}>取消</View>
          <View className={styles.ok} onClick={onBtnClick}>确定</View>
        </View>
      </View>
    </Popup>);
};

export default deletePop;
