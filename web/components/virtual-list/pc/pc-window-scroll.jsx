import React, { useRef, forwardRef, useState, useEffect } from 'react';
import './index.scss';
import Item from './item';
import BottomView from '../BottomView';

import { getImmutableTypeHeight, getLogHeight, getSticksHeight, getTabsHeight } from '../utils';

import { List, CellMeasurer, CellMeasurerCache, AutoSizer, InfiniteLoader, WindowScroller } from 'react-virtualized';
import { inject, observer } from 'mobx-react';

import styles from './index.module.scss';

const immutableHeightMap = {}; // 不可变的高度

let preScrollTop = 0;
let scrollTimer;
// 增强cache实例
function extendCache(instance) {
  instance.getDefaultHeight = ({ index, data }) => {
    if (!data) {
      return 0;
    }

    // 获取不可变的元素高度
    const immutableHeight = getImmutableTypeHeight(data);
    immutableHeightMap[index] = immutableHeight;

    const variableHeight = 0;

    const rowHeight = immutableHeight + variableHeight + 10;

    return rowHeight;
  };

  instance.rowHeight = ({ index, data }) => {
    const key = instance._keyMapper(index, 0);
    const height =
      instance._rowHeightCache[key] !== undefined
        ? instance._rowHeightCache[key]
        : instance.getDefaultHeight({ index, data });

    return height;
  };
}

function Home(props, ref) {
  let cache = props.vlist.cache;

  const { platform = 'h5', left, right, pageName } = props;

  if (!cache) {
    cache = new CellMeasurerCache({
      fixedWidth: true,
      show: false,
    });

    extendCache(cache);
    props.vlist.setCache(cache);
  }

  const [list, setList] = useState([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  let listRef = useRef(null);
  let loadData = false;
  const rowCount = list.length;

  const [flag, setFlag] = useState(true);

  // 监听list列表
  useEffect(() => {
    setList([{ type: 'header' }, ...(props.list || []), { type: 'footer' }]);
  }, [props.list]);

  // 监听置顶列表
  useEffect(() => {
    recomputeRowHeights(0);
  }, [props.sticks]);

  useEffect(() => {
    if (listRef) {
      listRef.scrollToPosition && listRef.scrollToPosition(props.vlist.home || 0);
    }
  }, [listRef?.Grid?.getTotalRowsHeight()]);

  // 重新计算指定的行高
  const recomputeRowHeights = (index) => {
    listRef?.recomputeRowHeights && listRef?.recomputeRowHeights(index);
  };

  // 获取每一行元素的高度
  const getRowHeight = ({ index }) => {
    const data = list[index];

    if (!data) {
      return 0;
    }

    // 头部
    if (data.type === 'header') {
      return getLogHeight(platform) + getTabsHeight(platform) + getSticksHeight(props.sticks, platform);
    }

    // 底部
    if (data.type === 'footer') {
      return 60;
    }
    return cache.rowHeight({ index, data });
  };

  const renderListItem = (type, data, measure, { index, key, parent, style }) => {
    switch (type) {
      case 'header':
        return props.children;
      case 'footer':
        return <BottomView noMore={props.noMore} isError={props.requestError} platform={props.platform}></BottomView>;
      default:
        return <Item data={data} measure={measure} recomputeRowHeights={() => recomputeRowHeights(index)} />;
    }
  };

  const rowRenderer = ({ index, key, parent, style }) => {
    const data = list[index];

    if (!data) {
      return '';
    }

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} rowIndex={index} parent={parent}>
        {({ measure, registerChild }) => (
          <div
            ref={registerChild}
            key={key}
            style={style}
            data-index={index}
            data-key={key}
            data-id={data.threadId}
            data-height={immutableHeightMap[index]}
          >
            {renderListItem(data.type, data, flag ? measure : () => {}, {
              index,
              key,
              parent,
              style,
            })}
          </div>
        )}
      </CellMeasurer>
    );
  };

  // 滚动事件
  const onScroll = ({ scrollTop, clientHeight, scrollHeight }) => {
    //  && // scrollToPosition = scrollTop;
    setFlag(!(scrollTop < preScrollTop));
    preScrollTop = scrollTop;

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      setFlag(true);
    }, 100);

    props.onScroll && props.onScroll({ scrollTop, clientHeight, scrollHeight });
    if (scrollTop !== 0) {
      props.vlist.setPosition(scrollTop);
    }

    if (scrollTop + clientHeight + clientHeight >= scrollHeight && !loadData) {
      loadData = true;
      props.loadNextPage().finally(() => {
        loadData = false;
      });
    }
  };

  const isRowLoaded = ({ index }) => !!list[index];

  const loadMoreRows = ({ startIndex, stopIndex }) => Promise.resolve();

  const clearAllCache = () => {
    cache.clearAll();
  };

  // 自定义扫描数据范围
  const overscanIndicesGetter = ({ cellCount, scrollDirection, overscanCellsCount, startIndex, stopIndex }) => {
    // 往回滚动
    if (scrollDirection === -1) {
      return {
        overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
        overscanStopIndex: Math.min(cellCount - 1, stopIndex + overscanCellsCount),
      };
    }

    return {
      overscanStartIndex: Math.max(0, startIndex - overscanCellsCount),
      overscanStopIndex: Math.min(cellCount - 1, stopIndex),
    };
  };

  const [scrollElement, setElement] = useState(null);
  useEffect(() => {
    setElement(document.querySelector('.home'));
  }, []);

  return (
    <div className="page">
      {scrollElement && (
        <WindowScroller scrollElement={scrollElement}>
          {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
            <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
              {({ onRowsRendered }) => (
                <AutoSizer disableHeight>
                  {({ width }) => (
                    <div className={styles.center} ref={registerChild}>
                      <List
                        ref={(ref) => {
                          listRef = ref;
                          // registerChild(ref);
                        }}
                        onScroll={onScroll}
                        deferredMeasurementCache={cache}
                        height={height}
                        autoHeight={true}
                        isScrolling={false}
                        overscanRowCount={20}
                        onRowsRendered={(...props) => {
                          onRowsRendered(...props);
                        }}
                        rowCount={rowCount}
                        rowHeight={getRowHeight}
                        rowRenderer={rowRenderer}
                        scrollTop={scrollTop}
                        width={width}
                        // overscanIndicesGetter={overscanIndicesGetter}
                      />
                    </div>
                  )}
                </AutoSizer>
              )}
            </InfiniteLoader>
          )}
        </WindowScroller>
      )}
    </div>
  );

  // return (
  //   <div className="page">
  //     <InfiniteLoader isRowLoaded={isRowLoaded} loadMoreRows={loadMoreRows} rowCount={rowCount}>
  //       {({ onRowsRendered }) => (
  //         <WindowScroller>
  //           {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => {
  //             return (
  //               <AutoSizer disableHeight>
  //                 {({ width }) => (
  //                   <div className={styles.center} ref={registerChild}>
  //                     <List
  //                       ref={(ref) => {
  //                         listRef = ref;
  //                       }}
  //                       onScroll={onScroll}
  //                       deferredMeasurementCache={cache}
  //                       height={height}
  //                       autoHeight={true}
  //                       isScrolling={false}
  //                       overscanRowCount={20}
  //                       onRowsRendered={(...props) => {
  //                         onRowsRendered(...props);
  //                       }}
  //                       rowCount={rowCount}
  //                       rowHeight={getRowHeight}
  //                       rowRenderer={rowRenderer}
  //                       scrollTop={scrollTop}
  //                       width={width}
  //                       overscanIndicesGetter={overscanIndicesGetter}
  //                     />
  //                     //{' '}
  //                   </div>
  //                 )}
  //               </AutoSizer>
  //             );
  //           }}
  //         </WindowScroller>
  //       )}
  //     </InfiniteLoader>
  //   </div>
  // );
}

export default inject('vlist')(observer(forwardRef(Home)));
