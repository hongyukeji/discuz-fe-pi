/**
 * 附件操作栏比如：图片上传、视频上传、语音上传等
 */
import React from 'react';
import { Icon } from '@discuzq/design';
import styles from './index.module.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { attachIcon } from '../const';
import { createAttachment } from '@common/server';

// TODO: upload 待单独独立出来
function fileToObject(file) {
  return {
    ...file,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    originFileObj: file,
  };
}

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

function getObjectURL(file) {
  let url = null;
  if (window.createObjcectURL !== undefined) {
    url = window.createOjcectURL(file);
  } else if (window.URL !== undefined) {
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL !== undefined) {
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

class AttachmentToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAll: false,
      currentAction: 'PictureOutlinedBig',
    };
  }

  inputRef = React.createRef(null);

  handleAttachClick(item) {
    this.setState({ currentAction: item.name });
    this.props.onAttachClick(item);
  }

  handleToggle = () => {
    this.setState({ showAll: !this.state.showAll });
  }

  trggerInput = () => {
    this.inputRef.current.click();
  };

  uploadFiles = (files, item = {}) => {
    let cloneList = [...files];

    cloneList = cloneList.map((file, index) => {
      file.thumbUrl = getObjectURL(file);
      file.uid = file.uid ?? `${index}__${uuid()}`;
      return fileToObject(file);
    });

    this.props.onUploadChange(cloneList, item);

    cloneList.forEach(async (file) => {
      const formData = new FormData();
      formData.append('file', file.originFileObj);
      Object.keys((item.data || [])).forEach((elem) => {
        formData.append(elem, item.data[elem]);
      });
      const ret = await createAttachment(formData);
      this.props.onUploadComplete(ret, file, item);
    });
  }

  handleChange = (e, item) => {
    if (e.target instanceof HTMLInputElement) {
      const { files } = e.target;
      if (!files) {
        return;
      }
      this.uploadFiles(files, item);

      this.inputRef.current.value = null;
    }
  };

  render() {
    const { showAll, currentAction } = this.state;
    return (
      <div className={styles['dvditor-attachment-toolbar']}>
        {!showAll && (
          <>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              {this.props.category}
            </div>
            <div className={styles['dvditor-attachment-toolbar__right']}>
              <Icon name="PictureOutlinedBig" size="20" onClick={this.handleToggle} />
            </div>
          </>
        )}
        {showAll && (
          <div className={styles['dvditor-attachment-toolbar__inner']}>
            <div className={styles['dvditor-attachment-toolbar__left']}>
              {attachIcon.map((item) => {
                if (!item.isUpload) {
                  return <Icon key={item.name}
                    onClick={this.handleAttachClick.bind(this, item)}
                    className={styles['dvditor-attachment-toolbar__item']}
                    name={item.name}
                    color={item.name === currentAction && item.active}
                    size="20" />;
                }
                return (
                  <div key={item.name} onClick={this.trggerInput} style={{ display: 'inline-block' }}>
                    <Icon
                      onClick={this.handleAttachClick.bind(this, item)}
                      className={styles['dvditor-attachment-toolbar__item']}
                      name={item.name}
                      color={item.name === currentAction && item.active}
                      size="20" />
                    <input
                      style={{ display: 'none' }}
                      type="file"
                      ref={this.inputRef}
                      onChange={(e) => {
                        this.handleChange(e, item);
                      }}
                      multiple={item.limit > 1}
                      accept={item.accept}
                    />
                  </div>
                );
              })}
            </div>
            <div className={classNames(styles['dvditor-attachment-toolbar__right'], styles.show)}>
              <Icon name="PhoneOutlined" size="20" onClick={this.handleToggle} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

AttachmentToolbar.propTypes = {
  onAttachClick: PropTypes.func,
  category: PropTypes.element,
};

export default AttachmentToolbar;