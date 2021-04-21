import React from 'react';
import LoginPhoneH5Page from '@layout/user/h5/phone-login';
import { inject } from 'mobx-react';
import { Input, Button, Toast } from '@discuzq/design';
import { h5WechatCodeLogin } from '@server';
import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';
import { get } from '../../../../common/utils/get';
import setAccessToken from '../../../../common/utils/set-access-token';
const NEED_BIND_OR_REGISTER_USER = -7016;
@inject('site')
@inject('user')
class WeixinAuth extends React.Component {
  async componentDidMount() {
    const { router } = this.props;
    const { code, sessionId, sessionToken, state, action } = router.query;

    // 如果要进行绑定逻辑，跳转绑定相关的页面
    if (action === 'wx-bind') {
      router.push(`/user/wx-bind?code=${code}&sessionId=${sessionId}&sessionToken=${sessionToken}&state=${state}`);
      return;
    }

    try {
      const res = await h5WechatCodeLogin({
        timeout: 10000,
        method: 'GET',
        params: {
          code,
          sessionId,
          sessionToken,
          state,
        },
      });

      // 落地页开关打开
      if (res.code === NEED_BIND_OR_REGISTER_USER) {
        const { sessionToken, accessToken, nickname } = res.data;
        this.props.user.nickname = nickname;
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        router.push({ pathname: 'wx-select', query: { sessionToken, nickname } });
        return;
      }

      if (res.code === 0) {
        const accessToken = get(res, 'data.accessToken');
        // 注册成功后，默认登录
        setAccessToken({
          accessToken,
        });
        // todo push中间页面
        router.push({ pathname: '/' });
        return;
      }

      throw {
        Code: res.code,
        Message: res.msg,
      };
    } catch (error) {
      if (error.Code) {
        Toast.error({
          content: error.Message,
        });
      }
      throw {
        Code: 'ulg_9999',
        Message: '网络错误',
        error,
      };
    }
  }


  render() {
    return <></>;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(WeixinAuth);