import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button, Toast, Icon } from '@discuzq/design';
import layout from './index.module.scss';
import HomeHeader from '@components/home-header';
import Header from '@components/header';
import { NEED_BIND_WEIXIN_FLAG, NEED_BIND_PHONE_FLAG } from '@common/store/login/user-login-store';
import { BANNED_USER, REVIEWING, REVIEW_REJECT, isExtFieldsOpen } from '@common/store/login/util';
import { get } from '@common/utils/get';
import { genMiniScheme } from '@server';
import Protocol from '../components/protocol';
import browser from '../../../../../common/utils/browser';
import PcBodyWrap from '../components/pc-body-wrap';

import { MOBILE_LOGIN_STORE_ERRORS } from '@common/store/login/mobile-login-store';


@inject('site')
@inject('user')
@inject('thread')
@inject('userLogin')
@inject('commonLogin')
@observer
class PiLoginH5Page extends React.Component {
  async componentDidMount() {
    console.log('componentDidMount');
    await this.generateQrCode();
  }

  componentWillUnmount() {
    console.log('componentWillUnmount');
  }

  async generateQrCode() {
    console.log('generateQrCode');

    console.log('generateQrCode', navigator.appname);

    const browser = this.getBrowser();
    console.log('browser', browser);

    const oScript = document.createElement('script');
    oScript.type = 'text/javascript';
    oScript.src = 'https://sdk.minepi.com/pi-sdk.js';
    document.body.appendChild(oScript);

    const Pi = window.Pi;

    if (Pi) {
      console.log('pi debug', 'yes');

      Pi.init({
        version: '2.0',
      });

      throw {
        Code: 'ulg_0000',
        // Message: '请填写完整信息',
        Message: '发现Pi对象',
      };
    } else {
      console.log('pi debug', 'Pi对象不存在');

      throw {
        Code: 'ulg_0000',
        // Message: '请填写完整信息',
        Message: 'Pi对象不存在',
      };
    }

    // const script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.async = true;
    // script.src = 'http://code.jquery.com/jquery-migrate-1.2.1.min.js';
    // document.head.appendChild(script);

    // console.log('generateQrCode', window.$);
    // console.log("使用的浏览器是：", navigator.appVersion.split(" ")[9]);
  }

  getBrowser = () => {
    const userAgent = navigator.userAgent;
    const isOpera = userAgent.indexOf('Opera') > -1;
    if (isOpera) {
      return 'Opera';
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'FF';
    }
    if (userAgent.indexOf('Chrome') > -1) {
      return 'Chrome';
    }
    if (userAgent.indexOf('Safari') > -1) {
      return 'Safari';
    }
    if (userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) {
      return 'IE';
    }
    return false;
  };


  loginErrorHandler = async (e) => {
    // 补充昵称
    if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_BIND_USERNAME.Code || e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_ALL_INFO.Code) {
      const uid = get(e, 'uid', '');
      uid && this.props.user.updateUserInfo(uid);

      if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_ALL_INFO.Code) {
        this.props.commonLogin.needToCompleteExtraInfo = true;
      }

      this.props.router.replace('/user/bind-nickname');
      return;
    }

    // 跳转补充信息页
    if (e.Code === MOBILE_LOGIN_STORE_ERRORS.NEED_COMPLETE_REQUIRED_INFO.Code) {
      const uid = get(e, 'uid', '');
      uid && this.props.user.updateUserInfo(uid);
      if (isExtFieldsOpen(this.props.site)) {
        this.props.commonLogin.needToCompleteExtraInfo = true;
        return this.props.router.replace('/user/supplementary');
      }
      return window.location.href = '/';
    }

    // 微信绑定
    if (e.Code === NEED_BIND_WEIXIN_FLAG) {
      const { wechatEnv, platform } = this.props.site;
      // 设置缓存
      if (e.uid) {
        this.props.commonLogin.setUserId(e.uid);
      }
      e.accessToken && this.props.commonLogin.setLoginToken(e.accessToken);
      this.props.commonLogin.needToBindWechat = true;
      this.props.commonLogin.sessionToken = e.sessionToken;
      this.props.router.replace(`/user/wx-bind-qrcode?sessionToken=${e.sessionToken}&loginType=${platform}&nickname=${e.nickname}&isSkip=${true}`);
      return;
    }

    // 手机号绑定 flag
    if (e.Code === NEED_BIND_PHONE_FLAG) {
      this.props.commonLogin.needToBindPhone = true;
      this.props.router.replace(`/user/bind-phone?sessionToken=${e.sessionToken}`);
      return;
    }

    // 跳转状态页
    if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
      const uid = get(e, 'uid', '');
      uid && this.props.user.updateUserInfo(uid);
      this.props.commonLogin.setStatusMessage(e.Code, e.Message);
      this.props.router.replace(`/user/status?statusCode=${e.Code}&statusMsg=${e.Message}`);
      return;
    }

    Toast.error({
      content: e.Message || e,
      hasMask: false,
      duration: 1000,
    });
  };

  handleLoginButtonClick = async () => {
    const { commonLogin } = this.props;
    try {
      if (!commonLogin.loginLoading) {
        return;
      }
      commonLogin.loginLoading = false;
      // const resp = await this.props.userLogin.login();
      console.log('pi->piLogin()->start');
      const resp = await this.props.userLogin.piLogin();
      console.log('pi->piLogin()->end');
      commonLogin.loginLoading = true;
      const uid = get(resp, 'data.uid', '');
      // const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '登录成功',
        hasMask: false,
        duration: 1000,
        onClose() {
          window.location.href = '/';
        },
      });
    } catch (e) {
      commonLogin.loginLoading = true;
      this.loginErrorHandler(e);
    }
  };

  render() {
    const { site, commonLogin, invite, router } = this.props;
    const { platform } = site;
    const isAnotherLoginWayAvailable = this.props.site.wechatEnv !== 'none' || this.props.site.isUserLoginVisible;
    // 接受监听一下协议的数据，不能去掉，去掉后协议的点击无反应
    const { protocolVisible, loginLoading } = commonLogin;
    return (
      <PcBodyWrap>
        <div className={platform === 'h5' ? layout.container : layout.pc_container}>
          {
            platform === 'h5'
              ? <HomeHeader hideInfo mode="login"/>
              : null
          }
          <div className={platform === 'h5' ? layout.content : layout.pc_content}>
            <div className={platform === 'h5' ? layout.title : layout.pc_title}>Pi登录</div>
            {/* 登录按钮 start */}
            <Button loading={!loginLoading}
                    className={platform === 'h5' ? layout.button : layout.pc_button} type="primary"
              // disabled={!this.props.userLogin.isInfoComplete}
                    onClick={this.handleLoginButtonClick}>
              Pi用户登录 Pi User Login
            </Button>
            {/* 登录按钮 end */}
            {isAnotherLoginWayAvailable
              &&
              <div className={platform === 'h5' ? layout['otherLogin-title'] : layout.pc_otherLogin_title}>其他登录方式</div>}
            <div className={platform === 'h5' ? layout['otherLogin-button'] : layout.pc_otherLogin_button}>
              {this.props.site.isUserLoginVisible && (
                <span
                  onClick={() => {
                    this.props.router.replace('/user/username-login');
                  }}
                  className={platform === 'h5' ? layout['otherLogin-button-weixin'] : layout.button_left}
                >
                <Icon size={20} name="UserOutlined" color="#4084FF"/>
              </span>
              )}
              {this.props.site.isSmsOpen && (
                <span
                  onClick={() => {
                    this.props.router.replace('/user/phone-login');
                  }}
                  className={platform === 'h5' ? layout['otherLogin-button-user'] : layout.button_right}
                >
                <Icon size={20} name="PhoneOutlined" color="#FFC300"/>
              </span>
              )}
            </div>
            <Protocol/>
          </div>
        </div>
      </PcBodyWrap>
    );
  }
}

export default withRouter(PiLoginH5Page);
