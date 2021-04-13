import React from 'react';
import { inject, observer } from 'mobx-react';
import Link from 'next/link';
import { Button } from '@discuzq/design';
import styles from './index.module.scss';
import '@discuzq/design/styles/index.scss';

@inject('site')
@inject('user')
@inject('index')
@observer
class IndexH5Page extends React.Component {
  render() {
    const { index, user } = this.props;
    return (
      <div>
        { user.userInfo && <h1>{user.userInfo.username}</h1> }
        {
          index.categories ? index.categories.map((item, index) => <h1 key={index}>{item.name}</h1>) : null
        }
        <p className={styles.text}>test</p>
        <Link href='/my/profile'>我的资料</Link>
        <Link href='/detail'>detauil</Link>
        <Link href='/user'>user</Link>
        <Button>Fuck</Button>
      </div>
    );
  }
}

export default IndexH5Page;
