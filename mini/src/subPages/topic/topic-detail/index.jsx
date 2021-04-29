import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexPage from '@layout/topic/topic-detail';
import { readTopicsList } from '@server';
import { Toast } from '@discuzq/design';
import { getCurrentInstance } from '@tarojs/taro';
// import HOCFetchSiteData from '@common/middleware/HOCFetchSiteData';

@inject('site')
@inject('topic')
@observer
class Index extends React.Component {
  // static async getInitialProps(ctx) {
  //   const id = ctx?.query?.id;

  //   const topicFilter = {
  //     topicId: id,
  //   };
  //   const result = await readTopicsList({ params: { filter: topicFilter } });

  //   return {
  //     serverTopic: {
  //       topicDetail: result?.data,
  //     },
  //   };
  // }

  page = 1;
  perPage = 10;

  // constructor(props) {
  //   super(props);
  //   const { serverTopic, topic } = this.props;
  //   // 初始化数据到store中
  //   serverTopic && serverTopic.topicDetail && topic.setTopicDetail(serverTopic.topicDetail);
  // }

  async componentDidMount() {
    // const { topic, router } = this.props;
    // const { id = '' } = router.query;
    const { topic } = this.props;
    const { id = '' } = getCurrentInstance().router.params;
    // 当服务器无法获取数据时，触发浏览器渲染
    // const hasTopics = !!topic.topicDetail;

    // if (!hasTopics) {
    //   this.toastInstance = Toast.loading({
    //     content: '加载中...',
    //     duration: 0,
    //   });

      this.page = 1;
      await topic.getTopicsDetail({ topicId: id });

      // this.toastInstance?.destroy();
    // }
  }

  render() {
    return <IndexPage dispatch={this.dispatch} />;
  }
}

// eslint-disable-next-line new-cap
// export default HOCFetchSiteData(Index);
export default Index;