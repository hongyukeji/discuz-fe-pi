import React from 'react';
import { inject, observer } from 'mobx-react';
import { STEP_MAP } from '@common/constants/payBoxStoreConstants';
import AmountRecognized from './amount-recognized';
import PayConfirmed from './pay-confirmed';
import { Dialog, Button, Checkbox } from '@discuzq/design';

@inject('payBox')
@observer
class PayBoxPc extends React.Component {
  render() {
    return (<Dialog  visible={this.props.payBox.visible} position="center" maskClosable={true}>
        {this.props.payBox.step === STEP_MAP.SURE && <AmountRecognized />}
        {this.props.payBox.step === STEP_MAP.PAYWAY && <PayConfirmed />}
    </Dialog>);
  }
}

export default PayBoxPc;
