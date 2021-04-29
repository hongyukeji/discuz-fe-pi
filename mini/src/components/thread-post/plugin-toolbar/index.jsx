
/**
 * 发帖页底部分类、图片等工具栏
 */
import React, { useState, useMemo, memo, useCallback } from 'react';
import { observer, inject } from 'mobx-react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import { Icon } from '@discuzq/design';
import { attachIcon } from '@common/constants/const';
import { THREAD_TYPE } from '@common/constants/thread-post';
import { Units } from '@components/common';

const Index = inject('site', 'threadPost')(observer((props) => {
  const { permissions, site, threadPost, clickCb, onCategoryClick } = props;

  // 控制插件icon的显示/隐藏
  const [plugShow, setplugShow] = useState(false);
  // 设置当前选中的插件
  const [currentplug, setCurrentplug] = useState({});

  const content = useCallback(
    () => {
      const { parent, child } = threadPost.categorySelected;
      return `${parent.name || ''}${child.name ? ` \\ ${child.name}` : ''}`;
    },
    [threadPost.categorySelected],
  )

  // 插件icon元素
  const plug = useMemo(() => {
    const permissionMap = {
      [THREAD_TYPE.image]: permissions?.insertImage?.enable, // 图片权限
      [THREAD_TYPE.video]: permissions?.insertVideo?.enable, // 视频权限
      [THREAD_TYPE.voice]: permissions?.insertAudio?.enable, // 音频权限
      [THREAD_TYPE.goods]: permissions?.insertGoods?.enable, // 商品权限
      [THREAD_TYPE.reward]: permissions?.insertReward?.enable, // 悬赏权限
    };
    return attachIcon.map((item, index) => {
      // 是否有权限
      const canInsert = permissionMap[item.type];
      return canInsert ? (
        <Icon
          key={index}
          className={styles['plug-icon']}
          onClick={() => {
            setCurrentplug(item);
            clickCb(item);
          }}
          name={item.name}
          color={item.name === currentplug.name && item.active}
          size='20'
        />
      ) : null;
    });
  }, [permissions])

  // 分类元素
  const category = (
    <>
      <Icon
        name="SettingOutlined"
        size='20'
        className={styles['icon']}
        onClick={onCategoryClick}
      />
      <Text>分类</Text>
      <Units type='tag' tagContent={content() || '选择分类(必选)'} onTagClick={() => {
        // 处理分类弹框等逻辑
      }} />
    </>
  );

  return (
    <View className={styles['container']}>
      <View className={styles['category']}>
        { plugShow ? plug : category }
      </View>
      <View onClick={() => {setplugShow(!plugShow);}}>
        { (!plugShow) && (<Icon name={currentplug.name || 'PictureOutlinedBig'} size='20' />) }
        <Icon name="MoreBOutlined" size='20' />
      </View>
    </View>
  );
}));

export default memo(Index);