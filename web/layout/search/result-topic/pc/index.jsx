import React from 'react';
import { inject, observer } from 'mobx-react';
import styles from './index.module.scss';
import BaseLayout from '@components/base-layout';
import SectionTitle from '../../../search/h5/components/section-title'
import TrendingTopicMore from '../../../search/pc/components/trending-topic-more';
import ActiveUsers from '../../../search/pc/components/active-users'
import { withRouter } from 'next/router';
@inject('site')
@inject('search')
@observer
class SearchResultTopicPCPage extends React.Component {
  redirectToSearchResultUser = () => {
    this.props.router.push('/search/result-user');
  };
  onTopicClick = data => console.log('topic click', data);
  renderRight = () => {
    const { users } = this.props.search;
    const { pageData = [], currentPage, totalPage } = users || { pageData: [] };
    return (
      <div className={styles.searchRight}>
        <div className={styles.section}>
          <SectionTitle title="活跃用户" onShowMore={this.redirectToSearchResultUser}/>
          <ActiveUsers data={pageData} onItemClick={this.onUserClick}/>
        </div>
      </div>
    )
  }
  renderContent = () => {
    const { topics } = this.props.search;
    const { pageData = [], currentPage, totalPage } = topics || { pageData: [] };
    return (
      <div className={styles.searchContent}>
        <div className={styles.section}>
          <SectionTitle title="潮流话题" isShowMore={false}/>
          <TrendingTopicMore data={pageData} onItemClick={this.onTopicClick}/>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div className={styles.searchWrap}>
        <BaseLayout
          left={() => <div></div>}
          right={ this.renderRight }
        >
          { this.renderContent }
        </BaseLayout>
      </div>
    );
  }
}

export default withRouter(SearchResultTopicPCPage);
