import React from 'react';
import { inject, observer } from 'mobx-react';
import IndexH5Page from '@layout/index/h5';
import IndexPCPage from '@layout/index/pc';
import { readCategories, readStickList, readThreadList } from '@server';
import { handleString2Arr } from '@common/utils/handleCategory';
import HOCFetchSiteData from '../middleware/HOCFetchSiteData';
import ViewAdapter from '@components/view-adapter';
import isServer from '@common/utils/is-server';

@inject('site')
@inject('index')
@inject('user')
@inject('baselayout')
@observer
class Index extends React.Component {

  state = {
    categoryError: false,
    categoryErrorText: '',
  }

  page = 1;
  prePage = 10;
  // static async getInitialProps(ctx, { user, site }) {
  //   const categories = await readCategories({}, ctx);
  //   const sticks = await readStickList({}, ctx);

  //   const threads = await readThreadList({ params: { filter: {
  //     sort: 1,
  //     attention: 0,
  //     essence: 0
  //   }, sequence: 0, perPage: 10, page: 1 } }, ctx);

  //   return {
  //     serverIndex: {
  //       categories: categories && categories.code === 0 ? categories.data : null,
  //       sticks: sticks && sticks.code === 0 ? sticks.data : null,
  //       threads: threads && threads.code === 0 ? threads.data : null,
  //     },
  //   };
  // }

  constructor(props) {
    super(props);
    const { serverIndex, index } = this.props;
    // 初始化数据到store中
    // serverIndex && serverIndex.categories && index.setCategories(serverIndex.categories);
    // serverIndex && serverIndex.sticks && index.setSticks(serverIndex.sticks);
    // serverIndex && serverIndex.threads && index.setThreads(serverIndex.threads);
  }

  componentDidMount() {
    const { index } = this.props;
    const { essence = 0, sequence = 0, attention = 0, sort = 1 } = index.filter;

    let newTypes = handleString2Arr(index.filter, 'types');

    let categoryIds = handleString2Arr(index.filter, 'categoryids');

    // 当服务器无法获取数据时，触发浏览器渲染
    const hasCategoriesData = !!index.categories;
    const hasSticksData = !!index.sticks;
    const hasThreadsData = !!index.threads;

    if (!hasCategoriesData) {
      this.props.index.getReadCategories();
    }

    if (!hasSticksData) {
      this.props.index.getRreadStickList(categoryIds);
    }
   
    if (!hasThreadsData) {
      this.props.index.getReadThreadList({
        sequence, 
        filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort } 
      });
    } else {
      // 如果store中有值，则需要获取之前的分页数
      this.page = index.threads.currentPage || 1
    }
  }

  dispatch = async (type, data = {}) => {
    const { index } = this.props;
    const newData = {...index.filter, ...data}
    const { essence, sequence, attention, sort, page } = newData;

    let newTypes = handleString2Arr(newData, 'types');

    let categoryIds = handleString2Arr(newData, 'categoryids');

    // 每次请求前，先判断错误状态，并重置
    if (this.props.index?.threadError?.isError) {
      this.props.index.threadError = {
        isError: false,
        errorText: ''
      }
    }

    if (type === 'click-filter') { // 点击tab
      this.page = 1;
      this.props.baselayout.setJumpingToTop();
      await index.screenData({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });
    } else if (type === 'moreData') {
      this.page += 1;
      return await index.getReadThreadList({
        perPage: this.prePage,
        page: this.page,
        filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort },
        sequence,
      });
    } else if (type === 'refresh-recommend') {
      await index.getRecommends({ categoryIds });
    } else if (type === 'update-page') {// 单独更新页数
      this.page = page
    } else if (type === 'refresh-thread') { // 点击帖子更新数的按钮，刷新帖子数据
      this.page = 1;
      return await index.getReadThreadList({ filter: { categoryids: categoryIds, types: newTypes, essence, attention, sort }, sequence, page: this.page, });
    }
  }

  render() {
    const { categoryName = '' } = this.props.index || {}
    return <ViewAdapter
            h5={<IndexH5Page dispatch={this.dispatch} />}
            pc={<IndexPCPage dispatch={this.dispatch} />}
            title={categoryName}
          />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(Index, (pass) => {
  // 因部署方式的问题，所有路径第一次访问都会访问index.html，导致会出现首页渲染出来之后跳转到制定的url地址，为了防止这种情况，对首页的渲染做一次判断，如果url不是首页连接，将不渲染首页。
  if (!isServer()) {
    const pathname = window.location.pathname;
    if (pathname === '/' || pathname === '/index') {
      return true;
    } else {
      return false;
    }
  }
  return pass;
});
