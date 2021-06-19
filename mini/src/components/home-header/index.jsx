import React from 'react';
import styles from './index.module.scss';
import Icon from '@discuzq/design/dist/components/icon/index';
import { inject, observer } from 'mobx-react';
import { View, Text, Image, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import SharePopup from '../thread/share-popup';
import isWeiXin from '@common/utils/is-weixin';
import { get } from '@common/utils/get';
import logoImg from '../../../../web/public/dzq-img/admin-logo-x2.png';
import joinLogoImg from '../../../../web/public/dzq-img/join-banner-bg.png';
import { numberFormat } from '@common/utils/number-format';
/**
 * 帖子头部
 * @prop {string} bgColor 背景颜色
 * @prop {boolean} hideInfo 隐藏站点信息
 */

@inject('site')
@inject('user')
@observer
class HomeHeader extends React.Component {
  state = {
    visible: false,
    height: 180,
  };

  domRef = React.createRef(null);

  getBgHeaderStyle(bgColor) {
    const { site } = this.props;
    const siteData = site.webConfig || {};

    if (siteData.setSite?.siteBackgroundImage) {
      return { backgroundImage: `url(${siteData.setSite.siteBackgroundImage})` };
    }
    return bgColor ? { background: bgColor } : { background: '#2469f6' };
  }

  getLogo() {
    // 站点加入页面logo图片定制
    const { mode } = this.props;
    if (mode === 'join') {
      return joinLogoImg;
    }

    const { site } = this.props;
    const siteData = site.webConfig || {};
    if (siteData.setSite?.siteHeaderLogo) {
      return siteData.setSite.siteHeaderLogo;
    }
    return logoImg;
  }

  goBack() {
    Taro.navigateBack({
      fail() {
        Taro.navigateTo({
          url: '/pages/index/index'
        });
      }
    });
  }

  getSiteInfo() {
    const { site } = this.props;
    const { webConfig } = site;
    const siteInfo = {
      countUsers: 0,
      countThreads: 0,
      siteAuthor: '',
      createDays: 0,
    };
    if (webConfig && webConfig.other) {
      siteInfo.countUsers = webConfig.other.countUsers;
      siteInfo.countThreads = webConfig.other.countThreads;
    }
    const siteAuthor = get(webConfig, 'setSite.siteAuthor.username', '');
    const siteInstall = get(webConfig, 'setSite.siteInstall', '');
    // 兼容ios
    const [siteTimer] = siteInstall.split(' ');
    const startDate = Date.parse(siteTimer);
    const endDate = Date.parse(new Date());
    const days = numberFormat(parseInt(Math.abs(startDate - endDate) / 1000 / 60 / 60 / 24, 10));

    siteInfo.siteAuthor = siteAuthor;
    siteInfo.createDays = days;

    return siteInfo;
  }

  onClose = () => {
    this.setState({ visible: false });
  };

  getStatusBarHeight() {
    return wx?.getSystemInfoSync()?.statusBarHeight || 44;
  }

  // 全屏状态下自定义左上角返回按钮位置
  getTopBarBtnStyle() {
    return {
      position: 'fixed',
      top: `${this.getStatusBarHeight()}px`,
      left: '12px',
      transform: 'translate(0, 10px)',
    };
  }

  getTopBarTitleStyle() {
    return {
      position: 'fixed',
      top: `${this.getStatusBarHeight()}px`,
      left: '50%',
      transform: 'translate(-50%, 8px)',
    };
  }

  componentDidMount() {
    if (this.domRef.current) {
      this.setState({ height: this.domRef.current.clientHeight });
    }
  }
  render() {
    const {
      bgColor,
      hideInfo = false,
      hideLogo = false,
      showToolbar = false,
      style = {},
      digest = null,
      mode = '',
      site,
      fullScreenTitle = ''
    } = this.props;
    const { visible } = this.state;
    const { countUsers, countThreads, siteAuthor, createDays } = this.getSiteInfo();
    const shareData = {
      title: site.webConfig?.setSite?.siteName || '',
      path: 'pages/index/index',
    };

    return (
        <View
          ref={this.domRef}
          className={`${styles.container} ${mode ? styles[`container_mode_${mode}`] : ''} ${
            hideLogo ? styles['hide_logo'] : ''
          }`}
          style={{ ...style, ...this.getBgHeaderStyle(bgColor) }}
        >
          {hideInfo && mode !== 'join' && (
            <View className={styles.topBar}>
              {mode === 'login' ? (
                <View onClick={() => this.goBack()} className={styles.left}>
                  <Icon name="LeftOutlined" />
                </View>
              ) : (
                <></>
              )}
              {/* <View>
            <Icon onClick={() => {
              Router.redirect({ url: '/' });
            }} name="HomeOutlined" color="#fff" size={20} />
          </View> */}
            </View>
          )}
          {showToolbar && (
            <View className={styles.topBar}>
              <View onClick={() => this.goBack()} className={styles.customCapsule} style={this.getTopBarBtnStyle()}>
                <Icon name="LeftOutlined" />
              </View>
              <View style={this.getTopBarTitleStyle()} className={styles.fullScreenTitle}>{ fullScreenTitle }</View>
            </View>
          )}
          {!hideLogo && (
            <View className={`${styles.logoBox} ${mode === 'join' ? styles['join-logo'] : ''}`}>
              <Image
                className={styles.logo}
                mode="aspectFit"
                src={this.getLogo()}
              />
            </View>
          )}
          {digest && (
            <View className={styles.digest}>
              <Text className={styles.left}>站长 {digest.admin || ''}</Text>
              <Text className={styles.right}>已创建 {digest.day || ''}天</Text>
            </View>
          )}
          {!hideInfo && (
            <View className={styles.siteInfo}>
              <View className={styles.item}>
                <Text className={styles.text}>成员</Text>
                <Text className={styles.content}>{countUsers}</Text>
              </View>
              <View className={styles.item}>
                <Text className={styles.text}>内容</Text>
                <Text className={styles.content}>{countThreads}</Text>
              </View>
              <Button className={styles.item} openType="share" plain="true" data-shareData={shareData}>
                <Icon className={styles.shareIcon} name="ShareAltOutlined" />
                <Text className={styles.shareText}>分享</Text>
              </Button>
            </View>
          )}
          {mode === 'join' && (
            <view className={`${styles.siteInfo} ${styles.joinInfo}`}>
              <view className={styles.item}>
                <view className={styles.text}>站长</view>
                <view className={styles.content}>{siteAuthor}</view>
              </view>
              <view className={styles.item}>
                <view className={styles.text}>已创建</view>
                <view className={styles.content}>{createDays}天</view>
              </view>
            </view>
          )}
          {isWeiXin && <SharePopup visible={visible} onClose={this.onClose} />}
        </View>
    );
  }
}

export default HomeHeader;
