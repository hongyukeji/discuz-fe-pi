import React from 'react';
import PiLoginH5Page from '@layout/user/h5/pi-login';
import { inject } from 'mobx-react';
import ViewAdapter from '@components/view-adapter';

import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import HOCLoginMode from '@middleware/HOCLoginMode';
import HOCPi from '@middleware/HOCPi';
import HOCWithNoLogin from '@middleware/HOCWithNoLogin';

@inject('site')
class PiLogin extends React.Component {
  render() {
    return <ViewAdapter
              h5={<PiLoginH5Page/>}
              pc={<PiLoginH5Page/>}
              title='Pi登录'
            />;
  }
}

// eslint-disable-next-line new-cap
export default HOCFetchSiteData(HOCWithNoLogin(HOCLoginMode('pi')(HOCPi(PiLogin))));
// export default HOCFetchSiteData(HOCWithNoLogin(HOCLoginMode('pi')(PiLogin)));
