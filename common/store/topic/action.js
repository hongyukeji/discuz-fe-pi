import { action } from 'mobx';
import TopicStore from './store';
import { readTopicsList } from '../../server';

class TopicAction extends TopicStore {
  constructor(props) {
    super(props);
  }

  @action
  setTopics(data) {
    this.topics = data;
  }

  @action
  setTopicDetail(data) {
    this.topicDetail = data;
  }

  /**
   * 话题 - 列表
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
    @action
    async getTopicsList({ search = '', sortBy = '1', perPage = 10, page = 1 } = {}) {
      const topicFilter = {
        sortBy,
        content: search,
        hot: 0
      };
      const result = await readTopicsList({ params: { filter: topicFilter, perPage, page } });

      if (result.code === 0 && result.data) {
        if (this.topics && result.data.pageData && page !== 1) {
          this.topics.pageData.push(...result.data.pageData);
          const newPageData = this.topics.pageData.slice();
          this.setTopics({ ...result.data, pageData: newPageData });
        } else {
          // 首次加载，先置空，是为了列表回到顶部
          this.setTopics({ pageData: [] });
          this.setTopics(result.data);
        }
        return result.data;
      }
      return null;
    };

  /**
   * 话题 - 列表
   * @param {object} search * 搜索值
   * @returns {object} 处理结果
   */
    @action
    async getTopicsDetail({ topicId = '' } = {}) {
      const topicFilter = {
        topicId,
        hot: 0
      };
      const result = await readTopicsList({ params: { filter: topicFilter } });

      if (result.code === 0 && result.data) {
        return this.setTopicDetail(result.data);
      }
      return null;
    };
}

export default TopicAction;