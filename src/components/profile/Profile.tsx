import React from 'react'
import styles from './styles/profile.module.scss'

const Profile = () => {
  return (
    <div className={styles.profile}>
        <div className={`${styles.header} item-center`}>
            <div className={`${styles.iconAcocunt} item-center`}>
                <i className="fa-regular fa-user"/>
            </div>
            <div className={styles.infoAccount}>
                <p className={styles.name}>Nguyễn Hồng Đức</p>
                <p className={styles.email}>hongduc935@gmail.com</p>
            </div>
        </div>
        <div className={styles.body}>
            <ul className={styles.list}>
                <li className={styles.item}><i className="fa-regular fa-user"></i><span className={styles.content}>View Profile</span></li>
                <li className={styles.item}><i className="fa-solid fa-gear"></i><span  className={styles.content}>Account Setting</span></li>
                <li className={styles.item}><i className="fa-regular fa-heart"></i><span  className={styles.content}>Login Activity</span></li>
            </ul>
        </div>
        <div className={styles.body}>
            <ul className={styles.list}>
                <li className={styles.item}><i className="fa-solid fa-arrow-right-from-bracket"></i><span className={styles.content}>Sign out</span></li>
            </ul>
        </div>
    </div>
  )
}

export default Profile