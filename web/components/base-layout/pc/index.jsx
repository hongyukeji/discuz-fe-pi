import React,  { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Flex } from '@discuzq/design';
import Header from '@components/header';
import List from '@components/list'
import RefreshView from '@components/list/RefreshView';
import ErrorView from '@components/list/ErrorView';

import styles from './index.module.scss';

/**
* PC端集成布局组件
* @prop {function} header 头部视图组件
* @prop {function} left 内容区域左部视图组件
* @prop {function} children 内容区域中间视图组件
* @prop {function} right 内容区域右部视图组件
* @prop {function} footer 底部视图组件
* @prop other List Props // List组件所有的属性
* @example 
*     <BaseLayout
        left={(props) => <div>左边</div>}
        right={(props) => <div>右边</div>}
      >
        {(props) => <div>中间</div>}
      </BaseLayout>
*/

const BaseLayout = (props) => {
  const {
    header = null,
    left = null,
    children = null,
    right = null,
    footer = null,
    onSearch,
    noMore = false,
    onRefresh,
    pageName = '',
    jumpTo = -1,
  } = props;

  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const size = useRef('xl');
  const listRef = useRef(null);

  const debounce = (fn, wait) => {
    let timer = null;
    return () => {
      if(timer !== null){
        clearTimeout(timer);
      }
      timer = setTimeout(fn, wait);
    }
  }

  const updateSize = debounce(() => {
    if (window) {
      size.current = calcSize(window.innerWidth);
      if (pageName !== 'home') {
        setShowLeft(left && (size.current === 'xl' || size.current === 'xxl'));
        setShowRight(right && (size.current === 'xl' || size.current === 'xxl' || size.current === 'lg'));
      } else {
        setShowRight(right && (size.current === 'xl' || size.current === 'xxl'));
        setShowLeft(left && (size.current === 'xl' || size.current === 'xxl' || size.current === 'lg'));
      }
    }
  }, 50);

  useEffect(() => {
    // if (window) {
    //   window.addEventListener('resize', updateSize);
    //   return () => {
    //       window.removeEventListener('resize', updateSize);
    //   };
    // }
    if(jumpTo > 0) {
      listRef.current.jumpToScrollTop(jumpTo);
    }
  }, [jumpTo]);

  useEffect(() => {
    size.current = calcSize(window.innerWidth);
    updateSize();
  }, [size.current])

  const calcSize = (width = 1600) => {
    let size = 'xl';

    // if (width < 992) {
    //     size = 'sm';
    // }
    // else if (width >= 992 && width < 1100) {
    //     size = 'md';
    // }
    // else if (width >= 1100 && width < 1400) {
    //     size = 'lg';
    // }
    // else if (width >= 1440 && width < 1880) {
    //     size = 'xl';
    // }
    // else {
    //     size = 'xxl';
    // }
    return size;
  };

  // const showLeft = useMemo(() => {
  //   return left && (size.current === 'xl' || size.current === 'xxl')
  // }, [size.current])

  // const showRight = useMemo(() => {
  //   return right && (size.current === 'xl' || size.current === 'xxl' || size.current === 'lg')
  // }, [size.current])

  return (
    <div className={styles.container}>
      {(header && header({ ...props })) || <Header onSearch={onSearch} />}

        <List {...props} immediateCheck={false} className={styles.list} wrapperClass={styles.wrapper} ref={listRef}>
          {
            (pageName === 'home' || showLeft) && (
              <div className={styles.left}>
                {typeof(left) === 'function' ? useCallback(left({ ...props }), []) : left}
              </div>
            )
          }

          <div className={styles.center}>
            {typeof(children) === 'function' ? children({ ...props }) : children}
            {onRefresh && <RefreshView noMore={noMore} />}
          </div>

          {
            (pageName === 'home' || showRight) && (
              <div className={`${styles.right} ${(pageName === "home") ? styles["home-right"] : ""}`}>
                {typeof(right) === 'function' ? right({ ...props }) : right}
              </div>
            )
          }
        </List>

      {typeof(footer) === 'function' ? footer({ ...props }) : footer}
    </div>
  );
};

export default BaseLayout;