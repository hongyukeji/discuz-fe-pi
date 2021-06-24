import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Avatar, ImagePreviewer } from '@discuzq/design';
import { diffDate } from '@common/utils/diff-date';
import { inject, observer } from 'mobx-react';
import s9e from '@common/utils/s9e';
import xss from '@common/utils/xss';
import styles from './index.module.scss';
import Router from '@discuzq/sdk/dist/router';

const DialogBox = (props) => {
  const { platform, message, user, dialogId, showEmoji, username } = props;
  const { readDialogMsgList, dialogMsgList, dialogMsgListLength, updateDialog } = message;
  const [previewerVisibled, setPreviewerVisibled] = useState(false);
  const [defaultImg, setDefaultImg] = useState('');
  // const router = useRouter();
  // const dialogId = router.query.dialogId;
  const dialogBoxRef = useRef();
  const timeoutId = useRef();
  useEffect(() => {
    if (platform !== 'pc') {
      document.addEventListener('focusin', () => {
        setTimeout(scrollEnd, 0);
      });
    }
    return () => clearTimeout(timeoutId.current);
  }, []);

  useEffect(() => {
    clearTimeout(timeoutId.current);
  }, [username]);

  useEffect(() => {
    if (dialogId) {
      clearTimeout(timeoutId.current);
      updateMsgList();
    }
  }, [dialogId]);

  useEffect(() => {
    if (showEmoji) {
      setTimeout(scrollEnd, 0);
    }
  }, [showEmoji]);

  const scrollEnd = () => {
    if (dialogBoxRef.current) {
      dialogBoxRef.current.scrollTop = dialogBoxRef?.current?.scrollHeight;
    }
  };

  // 每5秒轮询一次
  const updateMsgList = () => {
    readDialogMsgList(dialogId);
    clearTimeout(timeoutId.current);
    timeoutId.current = setTimeout(() => {
      updateMsgList();
    }, 5000);
  };

  const messagesHistory = useMemo(() => {
    setTimeout(() => {
      scrollEnd();
      // 把消息状态更新为已读
      updateDialog(dialogId);
    }, 100);
    return dialogMsgList.list.map(item => ({
      timestamp: item.createdAt,
      userAvatar: item.user.avatar,
      displayTimePanel: true,
      textType: 'string',
      text: item.messageTextHtml,
      ownedBy: user.id === item.userId ? 'myself' : 'itself',
      imageUrl: item.imageUrl,
      userId: item.userId,
      nickname: item.user.username,
    })).reverse();
  }, [dialogMsgListLength]);

  const imagePreviewerUrls = useMemo(() => {
    return dialogMsgList.list.filter(item => !!item.imageUrl).map(item => item.imageUrl).reverse();
  }, [dialogMsgList]);


  const renderImage = (url) => {
    // console.log(url);
    // const urlObj = new URL(url);
    // const width = urlObj.searchParams.get("width");
    // const height = urlObj.searchParams.get("height");
    let renderWidth = 200;

    // if (width && height) {
    //   if (width <= height) {
    //     renderWidth = 70;
    //   } else {
    //     renderWidth = 130;
    //   }
    // }
    return (
      <img
        className={styles.msgImage}
        style={{ width: `${renderWidth}px` }}
        src={url}
        onClick={() => {
          setDefaultImg(url);
          setTimeout(() => {
            setPreviewerVisibled(true);
          }, 0);
        }}
        onLoad={scrollEnd}
      />
    );
  };

  return (
    <div className={platform === 'pc' ? styles.pcDialogBox : (showEmoji ? styles['h5DialogBox-emoji'] : styles.h5DialogBox)} ref={dialogBoxRef}>
      <div className={styles.box__inner}>
        {messagesHistory.map(({ timestamp, displayTimePanel, text, ownedBy, userAvatar, imageUrl, userId, nickname }, idx) => (
          <React.Fragment key={idx}>
            {displayTimePanel && <div className={styles.msgTime}>{diffDate(timestamp)}</div>}
            <div className={`${ownedBy === 'myself' ? `${styles.myself}` : `${styles.itself}`} ${styles.persona}`}>
              <div className={styles.profileIcon} onClick={() => {
                userId && Router.push({ url: `/user/${userId}` });
              }}>
                {userAvatar
                  ? <Avatar image={userAvatar} circle={true} />
                  : <Avatar text={nickname && nickname.toUpperCase()[0]} circle={true} style={{
                    backgroundColor: "#8590a6",
                  }} />
                }
              </div>
              {imageUrl ? (
                renderImage(imageUrl)
              ) : (
                <div className={styles.msgContent} dangerouslySetInnerHTML={{
                  __html: xss(s9e.parse(text)),
                }}></div>
              )}
            </div>
          </React.Fragment>
        ))}
      </div>
      <ImagePreviewer
        visible={previewerVisibled}
        onClose={() => {
          setPreviewerVisibled(false);
        }}
        imgUrls={imagePreviewerUrls}
        currentUrl={defaultImg}
      />
    </div>
  );
};

export default inject('message', 'user')(observer(DialogBox));
