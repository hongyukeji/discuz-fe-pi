import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Input, Toast } from '@discuzq/design';
import Header from '@components/header';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';
import { withRouter } from 'next/router';
import throttle from '@common/utils/thottle.js';
import { trimLR } from '@common/utils/get-trimly.js';
import classNames from 'classnames';
@inject('site')
@inject('user')
@observer
class index extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.user.clearUserAccountPassword();
  }

  // 点击忘记密码
  handleResetPwd = () => {
    if (!this.props.user.mobile) {
      Toast.error({
        content: '需要首先绑定手机号才能进行此操作',
        duration: 2000,
      });
      return;
    }
    Router.push({ url: '/user/reset-password' });
  };

  // 输入旧密码
  handleSetOldPwd = (e) => {
    if (trimLR(e.target.value) === '' || !e.target.value) {
      this.props.user.oldPassword = null;
      return;
    }
    this.props.user.oldPassword = e.target.value;
  };

  // 设置账户密码
  handleSetPwd = (e) => {
    if (trimLR(e.target.value) === '' || !e.target.value) {
      this.props.user.newPassword = null;
      return;
    }
    this.props.user.newPassword = e.target.value;
  };

  // 确认新密码
  hadleNewPasswordRepeat = (e) => {
    if (trimLR(e.target.value) === '' || !e.target.value) {
      this.props.user.newPasswordRepeat = null;
      return;
    }
    this.props.user.newPasswordRepeat = e.target.value;
  };

  // 点击提交
  handleSubmit = throttle(async () => {
    if (this.getDisabledWithButton()) return;
    const newPassword = this.props.user?.newPassword;
    const newPasswordRepeat = this.props.user?.newPasswordRepeat;
    if (newPassword !== newPasswordRepeat) {
      Toast.error({
        content: '两次密码输入有误',
        hasMask: false,
        duration: 2000,
      });
      this.props.user.clearUserAccountPassword();
      return;
    }
    if (this.props.user.hasPassword) {
      this.props.user
        .resetUserPassword()
        .then((res) => {
          Toast.success({
            content: '修改密码成功',
            hasMask: false,
            duration: 2000,
          });
          Router.back();
          this.props.user.clearUserAccountPassword();
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '修改密码失败, 请重新设置',
            hasMask: false,
            duration: 2000,
          });
          this.props.user.clearUserAccountPassword();
        });
    } else {
      this.props.user
        .setUserPassword()
        .then((res) => {
          Toast.success({
            content: '设置密码成功',
            hasMask: false,
            duration: 2000,
          });
          Router.back();
          this.props.user.clearUserAccountPassword();
        })
        .catch((err) => {
          Toast.error({
            content: err.Message || '设置密码失败, 请重新设置',
            hasMask: false,
            duration: 2000,
          });
          this.props.user.clearUserAccountPassword();
        });
    }
  }, 300);

  // 渲染未设置密码
  renderHasNoPassword = () => (
    <>
      <h3>设置密码</h3>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            onChange={this.handleSetPwd}
            mode="password"
            placeholder="请设置密码"
            value={this.props.user?.newPassword}
            trim
          />
        </div>
      </div>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            mode="password"
            placeholder="请确认密码"
            value={this.props.user?.newPasswordRepeat}
            onChange={this.hadleNewPasswordRepeat}
            trim
          />
        </div>
      </div>
    </>
  );

  // 渲染已设置密码
  renderHasPassword = () => (
    <>
      <h3>修改密码</h3>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            value={this.props.user?.oldPassword}
            onChange={this.handleSetOldPwd}
            mode="password"
            placeholder="请输入旧密码"
            trim
          />
        </div>
      </div>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            value={this.props.user?.newPassword}
            onChange={this.handleSetPwd}
            mode="password"
            placeholder="请输入新密码"
            trim
          />
        </div>
      </div>
      <div className={styles.labelInfo}>
        <div className={styles.labelValue}>
          <Input
            className={styles.input}
            onChange={this.hadleNewPasswordRepeat}
            mode="password"
            value={this.props.user?.newPasswordRepeat}
            placeholder="请重复输入新密码"
            trim
          />
        </div>
      </div>
    </>
  );

  /**
   * 获取禁用按钮状态
   * @returns true 表示禁用 false 表示不禁用
   */
  getDisabledWithButton = () => {
    const oldPassword = this.props.user?.oldPassword;
    const newPassword = this.props.user?.newPassword;
    const newPasswordRepeat = this.props.user?.newPasswordRepeat;

    let isSubmit = false;
    if (this.props.user?.hasPassword) {
      isSubmit = !oldPassword || !newPassword || !newPasswordRepeat;
    } else {
      isSubmit = !newPassword || !newPasswordRepeat;
    }
    return isSubmit;
  };

  render() {
    return (
      <div id={styles.accountPwdContent}>
        <Header />
        <div className={styles.content}>
          {this.props.user?.hasPassword ? this.renderHasPassword() : this.renderHasNoPassword()}
        </div>
        {this.props.site?.isSmsOpen && this.props.user?.hasPassword && (
          <div onClick={this.handleResetPwd} className={styles.tips}>
            忘记旧密码？
          </div>
        )}
        <div
          className={classNames(styles.bottom, {
            [styles.bgBtnColor]: !this.getDisabledWithButton(),
          })}
        >
          <Button
            full
            onClick={this.handleSubmit}
            disabled={this.getDisabledWithButton()}
            type={'primary'}
            className={styles.btn}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(index);
