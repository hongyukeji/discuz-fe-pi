import React, { Component } from 'react';
import Router from '@discuzq/sdk/dist/router'
import { View,  } from '@tarojs/components';
import { Button} from '@discuzq/design';
import Page from '@components/page';
import styles from './index.module.scss';

class SiteError extends Component {
  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  render() {
    return (
      <Page>
        <View className={styles.page}>
          <View className={styles.text}>你访问的页面出错了</View>
        </View>
      </Page>
    );
  }
}

export default SiteError;
