import React from 'react'
import styles from './styles/detail-notification.module.scss'
const DetailNotification = (props:any) => {


  console.log(JSON.stringify(props?.data))

  return (
    <div className={`${styles.detailNotification} item-center`}> 
      <div className={styles.mainContent}>
        <p className={styles.title}>{props?.data?.user_notification_title}</p>
        <p className={styles.content}>{props?.data?.user_notification_content}</p>
        DetailNotification
          <button onClick={props?.handleClose} className={styles.btnClose}>X</button>
      </div>
       
        
    </div>
  )
}

export default DetailNotification