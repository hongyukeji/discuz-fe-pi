import React from 'react';
import { inject, observer } from 'mobx-react';

import SearchInput from '@components/search-input';
import BaseLayout from '@components/base-layout';
import SearchPosts from './components/search-posts';
import SearchTopics from './components/search-topics';
import SearchUsers from './components/search-users';
import SidebarPanel from '@components/sidebar-panel';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import Taro from '@tarojs/taro';
import { getCurrentInstance } from '@tarojs/taro';

@inject('site')
@inject('search')
@observer
class SearchResultPage extends React.Component {
  constructor(props) {
    super(props);
    const { keyword = '' } = getCurrentInstance().router.params;
  
    this.state = {
      keyword,
    };

    // 进入页面时搜索
    this.searchData(keyword);
  }

  redirectToSearchResultPost = () => {
    Taro.navigateTo({
      url: `/subPages/search/result-post/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultUser = () => {
    Taro.navigateTo({
      url: `/subPages/search/result-user/index?keyword=${this.state.keyword || ''}`
    })
  };

  redirectToSearchResultTopic = () => {
    Taro.navigateTo({
      url: `/subPages/search/result-topic/index?keyword=${this.state.keyword || ''}`
    })
  };

  onCancel = () => {
    Taro.navigateBack({ delta: 1});
  };

  searchData = (keyword) => {
    const { dispatch } = this.props;
    dispatch('search', keyword);
  };

  onSearch = (keyword) => {
    this.setState({ keyword }, () => {
      this.searchData(keyword);
    });
  };

  onUserClick = data => console.log('user click', data);

  onTopicClick = data => console.log('topic click', data);

  onPostClick = data => console.log('post click', data);

  render() {
    const { keyword } = this.state;

    const { searchTopics, searchUsers, searchThreads } = this.props.search;
    const { pageData: topicsPageData } = searchTopics || {};
    const { pageData: usersPageData } = searchUsers || {};
    const { pageData: threadsPageData } = searchThreads || {};

    return (
      <BaseLayout allowRefresh={false} showHeader={false}>
        <SearchInput onSearch={this.onSearch} onCancel={this.onCancel} defaultValue={keyword} />

        <SidebarPanel
          title="用户" 
          onShowMore={this.redirectToSearchResultUser}
          isLoading={!usersPageData}
          noData={!usersPageData?.length}
          platform='h5'
        >
          {
            usersPageData?.length && <SearchUsers data={usersPageData} onItemClick={this.onUserClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          title="主题" 
          onShowMore={this.redirectToSearchResultPost}
          isLoading={!threadsPageData}
          noData={!threadsPageData?.length}
          platform='h5'
          className={threadsPageData?.length && styles.bottom}
        >
          {
            threadsPageData?.length &&<SearchPosts data={threadsPageData.filter((_, index) => index < 3)} onItemClick={this.onPostClick} />
          }
        </SidebarPanel>

        <SidebarPanel
          title="话题" 
          onShowMore={this.redirectToSearchResultTopic}
          isLoading={!topicsPageData}
          noData={!topicsPageData?.length}
          platform='h5'
        >
          {
            topicsPageData?.length && <SearchTopics data={topicsPageData} onItemClick={this.onTopicClick} />
          }
        </SidebarPanel>
      </BaseLayout>
    );
  }
}

export default SearchResultPage;
