import React from 'react';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCWithLogin from '@middleware/HOCWithLogin';
import { inject, observer } from 'mobx-react';
import H5Page from '@layout/my/draft/h5';
import PCPage from '@layout/my/draft/pc';
import { THREAD_LIST_FILTER_COMPLEX } from '@common/constants/index';
import { Toast } from '@discuzq/design';
import { withRouter } from 'next/router';

@inject('site')
@inject('index')
@inject('thread')
@observer
class Draft extends React.Component {
  page = 1;
  perPage = 10;
  componentDidMount() {
    this.fetchData();
  }

  fetchData = async (isMore) => {
    const { index } = this.props;
    if (isMore) this.page += 1;
    else this.page = 1;
    await index.getReadThreadList({
      page: this.page,
      perPage: this.perPage,
      filter: { complex: THREAD_LIST_FILTER_COMPLEX.draft },
    });
    return;
  }

  handleEdit = item => this.props.router.push(`/thread/post?id=${item.threadId}`);

  handleDelete = async (item) => {
    const { thread, index } = this.props;
    this.toastInstance = Toast.loading({
      content: '删除中...',
      duration: 0,
    });
    const res = await thread.delete(item.threadId);
    this.toastInstance?.destroy();
    if (res.code === 0) {
      const data = (index.threads?.postData || []).filter(elem => elem.threadId !== item.threadId);
      index.setThreads(data);
    } else {
      Toast.error({ content: res.msg });
    }
  }

  render() {
    const { site } = this.props;
    const { platform } = site;

    if (platform === 'pc') {
      return <PCPage
        dispatch={this.fetchData}
        onEdit={item => this.handleEdit(item)}
        onDelete={item => this.handleDelete(item)}
      />;
    }
    return <H5Page
      dispatch={this.fetchData}
      onEdit={item => this.handleEdit(item)}
      onDelete={item => this.handleDelete(item)}
    />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithLogin(withRouter(Draft)));