import React from 'react'
import styles from './styles/topic-item.module.scss'
import Image from '@/components/image/Image'
import { Link } from 'react-router-dom'

const TopicItem = (props:any) => {
  return (
    <div className={styles.item} onClick={props?.handleOpen}>
        <div className={styles.option}>
            <i className="fa-solid fa-ellipsis-vertical"></i>
            <ul className={styles.listOption}>
                <li className={styles.itemOption}>
                    <span><Link to="/student-history-report/1">View History</Link></span>
                </li>
                <li className={styles.itemOption}>
                    <span><Link to="">Detail</Link></span>
                </li>
               
            </ul>
        </div>
        <div className={`${styles.image} item-center`}>
            <i className="fa-solid fa-folder"></i>
        </div>
        <div className={styles.titleItem}>
            Security
        </div>
    </div>
  )
}

export default TopicItem