import React from 'react';
import { View, Image } from '@tarojs/components';
import { Checkbox } from '@discuzq/design';
import styles from '../index.module.scss';

export default class ShopProductItemWebInstance extends React.Component {
  constructor(props) {
    super(props);
  }

  onChange = () => {
    this.props.onSelected(!this.props.isSelected);
  };

  render() {
    const { isSelected } = this.props;
    const { productId, imagePath, price, title } = this.props.productInfo;
    return (
      <View className={styles.productItem} onClick={this.onChange}>
        <Checkbox checked={isSelected} onChange={this.onChange} />
        <View className={styles.productItemBackgroundWrapper}>
          <View className={styles.productItemWrapper}>
            <View className={styles.productPic}>
              <Image src={imagePath} />
            </View>
            <View className={styles.productInfoWrapper}>
              <View className={styles.productInfoId}>{productId}</View>
              <View className={styles.productInfoTitle}>{title}</View>
              <View className={styles.productInfoPrice}>￥{price}</View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
