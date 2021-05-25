import React, { useState } from 'react';
import { Toast, Popup, Button, Textarea, Radio } from '@discuzq/design';
import { View } from '@tarojs/components';
import styles from './index.module.scss';

const InputPop = (props) => {
  const { visible, onOkClick, onCancel, inputText, reportContent = [] } = props;


  const [value, setValue] = useState('');
  const [showTextarea, setShowTextarea] = useState(false);


  const onChoiceChange = (e) => {
    if (e === 'other') {
      setShowTextarea(true);
      setValue('');
    } else {
      setShowTextarea(false);
      setValue(reportContent[Number(e)]);
    }
  };

  const onSubmitClick = async () => {
    if (typeof onOkClick === 'function') {
      try {
        const success = await onOkClick(value);
        if (success) {
          setValue('');
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Popup position="bottom" visible={visible} onClose={onCancel}>
      <View className={styles.container}>
        <View className={styles.header}>
          <View className={styles.title}>举报</View>
          <View className={styles.reason}>请点击举报理由</View>
        </View>
        <View className={styles.body}>
          <Radio.Group defaultValue='5' onChange={e => onChoiceChange(e)}>
            {
              reportContent.map((val, index) => (
                <View className={styles.reportTitle} key={index}>
                  <View className={styles.content}>{val}</View>
                  <Radio name={`${index}`} className={styles.radio}></Radio>
                </View>
              ))
            }
            <View className={styles.reportTitle}>
              <View className={styles.content}>其他</View>
              <Radio name="other"></Radio>
            </View>
          </Radio.Group>
          {
            showTextarea
              ? <View className={styles.textarea}>
              <Textarea
                className={styles.input}
                rows={5}
                showLimit
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder={inputText}>
              </Textarea>
            </View> : ''
          }
        </View>
        <View className={styles.button}>
          <Button full onClick={onSubmitClick} className={styles.ok} type="primary" size="large">
            确定
        </Button>
          <Button full onClick={onCancel} className={styles.cancel} type="primary" size="large">
            取消
        </Button>
        </View>
      </View>
    </Popup>
  );
};

export default InputPop;