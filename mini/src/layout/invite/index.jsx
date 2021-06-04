import React from 'react';
import { inject, observer } from 'mobx-react';
import { Image } from '@tarojs/components';
import Icon from '@discuzq/design/dist/components/icon/index';
import Toast from '@discuzq/design/dist/components/toast/index';
import Avatar from '@discuzq/design/dist/components/avatar/index';
import { View, Button } from '@tarojs/components';
import '@discuzq/design/dist/styles/index.scss';
import HomeHeader from '@components/home-header';
import layout from './index.module.scss';
import bgImage from './../../../../web/public/dzq-img/invite-banner-bg.png';

@inject('site')
@inject('user')
@inject('invite')
@observer
class InviteH5Page extends React.Component {
  async componentDidMount() {
    try {
      await this.props.invite.getInviteUsersList();
      await this.props.invite.createInviteLink();
    } catch (e) {
      Toast.error({
        content: e.Message,
      });
    }
  }

  render() {
    const { inviteData, inviteCode } = this.props.invite;
    const shareData = {
      path: `/subPages/forum/partner-invite/index?inviteCode=${inviteCode}`,
    };

    return (
      <>
        {/* 头部全屏的背景图片 */}
        <View className={layout.top_bg}>
          <Image src={bgImage} className={layout.top_bg_image} />
        </View>
        {/* 头部全屏的背景图片 end */}
        <HomeHeader hideInfo hideLogo showToolbar />
        <View className={layout.content}>
          {/* 用户信息 start */}
          <View className={layout.user_info}>
            <View className={layout.user_info_author}>
              <Avatar
                size={'big'}
                image={inviteData.avatar}
                text={inviteData.nickname && inviteData.nickname.substring(0, 1)}
              />
            </View>
            <View className={layout.user_info_content}>
              <View className={layout.user_info_name}>{inviteData.nickname}</View>
              <View className={layout.user_info_tag}>{inviteData.groupName}</View>
              <View className={layout.user_info_invite}>
                <View className={layout.invite_num}>
                  <View className={layout.invite_num_title}>已邀人数</View>
                  <View className={layout.invite_num_content}>{inviteData.totalInviteUsers}</View>
                </View>
                <View className={layout.invite_money}>
                  <View className={layout.invite_num_title}>赚得赏金</View>
                  <View className={layout.invite_num_content}>{inviteData.totalInviteBounties}</View>
                </View>
              </View>
            </View>
          </View>
          {/* 用户信息 end */}
          {/* 邀请列表 start */}
          <View className={layout.invite_list}>
            <View className={layout.invite_list_title}>
              <Icon className={layout.invite_list_titleIcon} color='#FFC300' name='IncomeOutlined'/>
              <View className={layout.invite_list_titleText}>邀请列表</View>
            </View>
            <View className={layout.invite_list_header}>
              <View className={layout.invite_list_headerName}>成员昵称</View>
              <View className={layout.invite_list_headerMoney}>获得赏金</View>
              <View className={layout.invite_list_headerTime}>推广时间</View>
            </View>
            <View className={layout.invite_list_content}>
              {
                inviteData?.inviteUsersList?.map((item, index) => (
                  <View key={index} className={layout.invite_list_item}>
                      <View className={layout.invite_list_itemName}>
                        <Avatar
                          className={layout.invite_list_itemAvatar}
                          image={item.avatar}
                          size='small'
                          text={item?.nickname?.substring(0, 1)}
                        />
                        <View>{item.nickname}</View>
                      </View>
                      <View className={layout.invite_list_itemMoney}>+{item.bounty}</View>
                      <View className={layout.invite_list_itemTime}>{item.joinedAt}</View>
                  </View>
                ))
              }
              {
                inviteData?.inviteUsersList?.length
                  ? <></>
                  : <View className={layout.refreshView}>
                      <View>暂无信息</View>
                    </View>
              }
            </View>
          </View>
          {/* 邀请列表 end */}
          {/* 邀请朋友 start */}
          <View className={layout.invite_bottom}>
            <Button className={layout.invite_bottom_button} openType="share" plain="true" data-shareData={shareData}>
              邀请朋友
            </Button>
          </View>
          {/* 邀请朋友 end */}
        </View>
      </>
    );
  }
}

export default InviteH5Page;