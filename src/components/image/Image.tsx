import React from 'react'
import styles from './styles/image.module.scss'
interface image {
    image: string
    contain?:string
}
const Image:React.FC<image>=(props:any)=>{
    return(
        <div className={`background-image ${props?.contain && props?.contain } ${styles.img}`} style={{backgroundImage:`url("${props.image}")`}}/>
    )
}
export default  Image
