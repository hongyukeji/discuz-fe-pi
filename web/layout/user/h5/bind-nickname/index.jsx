import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'next/router';
import { Button, Input, Toast } from '@discuzq/design';
import '@discuzq/design/dist/styles/index.scss';
import layout from './index.module.scss';
import HeaderLogin from '@common/module/h5/HeaderLogin';


@inject('site')
@inject('user')
@inject('thread')
@inject('nicknameBind')
@observer
class BindNicknameH5Page extends React.Component {
  handleNicknameChange = (e) => {
    this.props.nicknameBind.nickname = e.target.value;
  }

  handleBindButtonClick = async () => {
    try {
      const bindData = await this.props.nicknameBind.bindNickname();
    } catch (e) {
      Toast.error({
        content: e.Message,
        hasMask: false,
        duration: 1000,
      });
    }
  }

  render() {
    const { nicknameBind } = this.props;
    return (
      <div className={layout.container}>
        <HeaderLogin />
        <div className={layout.content}>
          <div className={layout.title}>设置昵称</div>
          <Input
            className={layout.input}
            value={nicknameBind.nickname}
            placeholder="昵称"
            onChange={this.handleNicknameChange}
          />
          <Button className={layout.button} type="primary" onClick={this.handleBindButtonClick}>
            下一步
          </Button>
          <div className={layout.functionalRegion}>
            <span className={layout.clickBtn} onClick={() => {
            }} >退出登录</span>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(BindNicknameH5Page);
