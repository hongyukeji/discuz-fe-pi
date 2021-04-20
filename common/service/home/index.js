import { readCategories, readStickList, readThreadList } from '../../server';

/**
   *  首页列表第一次进入时的数据
   * @returns {object} 处理结果
   */
export const getFirstData = async () => {
  const perPage = 10;

  const promise1 = readCategories();
  const promise2 = readStickList();
  const promise3 = readThreadList({ params: { perPage } });
  const promise = [promise1, promise2, promise3];

  let res = await Promise.allSettled(promise);

  res = res.map((item, index) => {
    const { value } = item;
    const { code, data } = value;
    if (index === 2) {
      return code === 0 ? data : {};
    }
    return code === 0 ? (data || []) : {};
  });

  return {
    res,
  };
};

/**
 * 首页 - 置顶 + 帖子
 * @param {array} categoryIds * 置顶接口的分类
 * @param {object} filter * 列表接口的过滤项
 * @returns {object} 处理结果
 */
export const getThreadList = async ({ categoryIds = '', filter = {}, perPage = 10, page = 1 } = {}) => {
  const promise1 = await readThreadList({ params: { perPage, page, filter } });
  const promise2 = readStickList({ params: { categoryIds } });
  const promise = [promise1];
  if (page === 1) {
    promise.push(promise2);
  }

  let res = await Promise.allSettled(promise);

  res = res.map((item) => {
    const { value } = item;
    const { code, data } = value;
    return code === 0 ? data : {};
  });

  return {
    res,
  };
};
