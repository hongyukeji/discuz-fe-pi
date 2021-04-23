import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Input, Button, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '../../../../components/login/h5/header-login';
import { BANNED_USER, REVIEWING, REVIEW_REJECT } from '@common/store/login/util';
import { get } from '@common/utils/get';
@inject('site')
@inject('user')
@inject('thread')
@inject('userRegister')
@inject('commonLogin')
@observer
class RegisterH5Page extends React.Component {
  handleRegister = async () => {
    try {
      const resp = await this.props.userRegister.register();
      const uid = get(resp, 'uid', '');
      this.props.user.updateUserInfo(uid);
      Toast.success({
        content: '注册成功',
        hasMask: false,
        duration: 1000,
      });
      // FIXME: Toast 暂时不支持回调能力
      // TODO: 完善这里的路由跳转逻辑
      setTimeout(() => {
        this.props.router.push('/index');
      }, 1000);
    } catch (e) {
      // 跳转状态页
      if (e.Code === BANNED_USER || e.Code === REVIEWING || e.Code === REVIEW_REJECT) {
        this.props.commonLogin.setStatusMessage(e.Code, e.Message);
        this.props.router.push('/user/status');
        return;
      }

      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  };
  render() {
    const { site } = this.props;
    const { platform } = site;
    return (
      <div className={platform === 'h5' ? layout.container : layout.pc_container}>
        <HeaderLogin />
        <div className={platform === 'h5' ? layout.content : layout.pc_content}>
          <div className={platform === 'h5' ? layout.title : layout.pc_title}>用户名注册</div>
          <Input
            className={platform === 'h5' ? layout.input : layout.pc_input}
            value={this.props.userRegister.username}
            placeholder="输入您的用户名"
            onChange={(e) => {
              this.props.userRegister.username = e.target.value;
            }}
          />
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            mode="password"
            value={this.props.userRegister.password}
            placeholder="输入您的登录密码"
            onChange={(e) => {
              this.props.userRegister.password = e.target.value;
            }}
          />
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            mode="password"
            value={this.props.userRegister.passwordConfirmation}
            placeholder="确认密码"
            onChange={(e) => {
              this.props.userRegister.passwordConfirmation = e.target.value;
            }}
          />
          <Input
            clearable={false}
            className={platform === 'h5' ? layout.input : layout.pc_input}
            value={this.props.userRegister.nickname}
            placeholder="输入您的昵称"
            onChange={(e) => {
              this.props.userRegister.nickname = e.target.value;
            }}
          />
          <Button className={platform === 'h5' ? layout.button : layout.pc_button} type="primary" onClick={this.handleRegister}>
            注册
          </Button>
          <div className={platform === 'h5' ? layout.functionalRegion : layout.pc_functionalRegion}>
            <span> 已有账号? </span>
            <span
              className={layout.clickBtn}
              onClick={() => {
                this.props.router.push('login');
              }}
            >
              登录
            </span>
          </div>
          <div className={platform === 'h5' ? layout['otherLogin-tips'] : layout.pc_otherLogin_tips}>注册登录即表示您同意《注册协议》《隐私协议》</div>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterH5Page);
