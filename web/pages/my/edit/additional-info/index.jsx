import React from 'react';
import UserCenterAdditionalInfo from '../../../../components/user-center/additional-info/index';
import HOCUserInfo from '@middleware/HOCUserInfo';
import HOCFetchSiteData from '@middleware/HOCFetchSiteData';
import ViewAdapter from '@components/view-adapter';
import { inject, observer } from 'mobx-react';

@inject('site')
@observer
class EditUserNamePage extends React.Component {
  render() {
    return (
      <ViewAdapter
        h5={
          <div>
            <UserCenterAdditionalInfo />
          </div>
        }
        pc={null}
        title={`补充信息`}
      />
    );
  }
}

export default HOCFetchSiteData(HOCUserInfo(EditUserNamePage));
