import TopicAPI from '@/apis/topic.api'
import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/register.module.scss'
import { SubmitHandler, useForm } from 'react-hook-form'
import Select from 'react-select';
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
const Register = (props:any) => {

    const { register,handleSubmit, formState: { errors }, } = useForm<Inputs>()
    const onSubmit: SubmitHandler<Inputs> = (data) =>{
        console.log(data)
    } 

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
        <div  className={`${styles.formRegister} item-center`}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

                <div className={`${styles.header} w-90 item-btw`}>
                    <p className={styles.title}></p>
                    <p className={`${styles.close} item-center`} onClick={props?.handleClose}><i className="fa-sharp fa-solid fa-xmark fa-beat"></i></p>
                </div>

                <div className={styles.itemInput}>
                    <p className={styles.label}>Tên nhóm</p>
                    <input  {...register("name_group",{required:true})} />
                </div>

                <div className={styles.itemInput}>
                    <p className={styles.label}>Giáo viên hướng dẫn</p>
                    <select {...register("gvhd",{required:true})}   >
                        <option>Huỳnh Xuân Phụng</option>
                        <option>Nguyễn Đăng Quang</option>
                        <option>Quách Đình Hoàng</option>
                    </select>
                    {errors.gvhd && <span>This field is required</span>}
                </div>

                <div className={styles.itemInput}>
                    <p className={styles.label}>Đề tài đăng kí</p>
                    <select {...register("topic",{required:true})}   >
                        <option>Trang web bán hàng </option>
                        <option>Công nghệ block chain trong bảo mật</option>
                        <option>Công nghệ AI </option>
                    </select>
                    {errors.topic && <span>This field is required</span>}
                </div>

                <div className={styles.itemInput}>
                    <p className={styles.label}>Sinh viên <span className={styles.note}>(3 - 5 sinh viên)</span></p>

                    <Select
                        value={students}
                        onChange={setStudents}
                        options={options}
                        isMulti
                    />
                    {errors.student && <span>This field is required</span>}
                </div>

                <div className={styles.itemInput}>
                    <p className={styles.label}>Học kì</p>
                    <select {...register("semester")}  >
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                    </select>
                    {errors.semester && <span>This field is required</span>}
                </div>

                <div className={styles.itemInput}   >
                    <p className={styles.label}>Năm học</p>
                    <input  {...register("year")} />
                    {errors.year && <span>This field is required</span>}
                </div>
                <div className={`${styles.btn} item-center w-100`}>
                    <button type='submit'>Đăng kí</button>
                </div>

            </form>
        </div>
    )
}

export default Register