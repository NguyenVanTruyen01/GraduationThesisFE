import { useCallback, useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select'
import styles from './styles/detail-register.module.scss'
import TopicAPI from '@/apis/topic.api'
// import FormReport from '../FormReport/FormReport'
type Inputs = {
    semester:number
    year:number
    name_group:string
    gvhd:string
    topic:string
    student:string
}

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];


const DetailRegister = (props:any) => {
    const { register,handleSubmit, formState: { errors }, } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) =>{
        console.log(data)
    } 

    let [openFormReport,setOpenFormReport] = useState<Boolean>(false)

    let [students,setStudents] = useState<any>(null)

    const [allTopic,setAllTopic] = useState([])
    const FetchDbCallBACK = useCallback(async()=>{
        return await TopicAPI.getAllTopic()
    },[])

  

    useEffect(()=>{
        FetchDbCallBACK().then((result:any)=>{
            setAllTopic(result?.data?.topics)
            console.log("allTopic:"+JSON.stringify(result))
        })
    },[])
  return (
    <div className={`${styles.detailRegister}  item-center`}>
        {
            openFormReport === true  ? 
                <div className={styles.report}>
                    {/* <FormReport handleClose = {()=>setOpenFormReport(false)}/>  */}
                </div>
            :

            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <div className={`${styles.header} w-90 item-btw`}>
                <p className={styles.title}></p>
                <p className={`${styles.close} item-center`} onClick={props?.handleClose}><i className="fa-sharp fa-solid fa-xmark fa-beat"></i></p>
            </div>

            <div className={styles.itemInput}>
                <p className={styles.label}>Tên nhóm</p>
                <input  {...register("name_group",{required:true})} disabled={true} />
            </div>

            <div className={styles.itemInput}>
                <p className={styles.label}>Giáo viên hướng dẫn</p>
                <select {...register("gvhd",{required:true})}   disabled={true} >
                    <option>Huỳnh Xuân Phụng</option>
                    <option>Nguyễn Đăng Quang</option>
                    <option>Quách Đình Hoàng</option>
                </select>
            </div>

            <div className={styles.itemInput}>
                <p className={styles.label}>Đề tài đăng kí</p>
                <select {...register("topic",{required:true})}  disabled={true} >
                    <option>Trang web bán hàng </option>
                    <option>Công nghệ block chain trong bảo mật</option>
                    <option>Công nghệ AI </option>
                </select>
            </div>

            <div className={styles.itemInput}>
                <p className={styles.label}>Sinh viên</p>
                <Select
                    value={students}
                    onChange={setStudents}
                    options={options}
                    isMulti
                />
            </div>

            <div className={styles.itemInput}>
                <p className={styles.label}>Học kì</p>
                <select {...register("semester")} disabled={true} >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                </select>
            </div>

            <div className={styles.itemInput}   >
                <p className={styles.label}>Năm học</p>
                <input  {...register("year")} disabled={true}/>
            </div>
            <div className={`${styles.btn} item-btw w-100`}>
                <button  className={styles.report1} onClick={()=>setOpenFormReport(true)}> <i className="fa-solid fa-plus"/> &nbsp;Báo cáo </button>
                <button type='submit'>Thêm thành viên</button>
            </div>
        </form>
        }
         
    </div>
  )
}

export default DetailRegister