import React from 'react';
import isServer from '@common/utils/is-server';
import isPi from '@common/utils/is-pi';
import { Toast } from '@discuzq/design';
import { inject } from 'mobx-react';

export default function HOCPi(Component) {
  @inject('site')
  class HOCPiComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isPi: false,
      };
      if (isServer() || !this.props.site.isOffiaccountOpen || this.props.site.isMiniProgramOpen) return;
      // 如果在微信环境内，则直接拉起登录
      if (isPi()) {
        this.target = Toast.loading({
          content: 'Pi登录中...',
          duration: 0,
        });
        this.state.isPi = true;
        const redirectEncodeUrl = encodeURIComponent(`${window.location.origin}/user/wx-auth`);
        window.location.href = `${window.location.origin}/api/v3/users/wechat/h5.oauth?redirect=${redirectEncodeUrl}`;
      }
    }
    componentWillUnmount() {
      if (isPi()) {
        this?.target?.hide();
      }
    }

    render() {
      return this.state.isWeixin ? <div>Loading</div> : <Component {...this.props} /> ;
    }
  }

  return HOCPiComponent;
}
