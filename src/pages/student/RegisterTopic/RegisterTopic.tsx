import { useCallback, useEffect, useState } from 'react'
import styles from './styles/register-topic.module.scss'
import StudentAPI from '@/apis/student/student.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import TopicStudentAPI from '@/apis/student/topic.api'
import { useSearchParams } from 'react-router-dom'
import Notify from '@/utils/Toast'
import PeriodAPI from '@/apis/student/period.api'

type Inputs = {
    student_id1: string
    student_id2: string
    student_id3: string
    teacher: string,
    topic: string
    description: string
}

const RegisterTopic = () => {

    let [searchParams, setSearchParams] = useSearchParams();

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
        try {
            let newData = {
                topic_group_student: [data?.student_id1, data?.student_id2, data?.student_id3]
            }

            const result: any = await TopicStudentAPI.registerTopic(data);

            if (result?.statusCode === 200) {
                Notify("Đăng kí đề tài thành  công.")
            }
            else {
                Notify("Đăng kí đề tài thất bại.")
            }

        } catch (error: any) {
            Notify(error.response?.data?.message);
        }

    }

    const [listStudent, setListStudent] = useState([])

    const fetchAllStudent = useCallback(async () => {
        return await StudentAPI.getAllStudent();
    }, [])

    const fetchDetailTopicById = useCallback(async () => {
        return await StudentAPI.getAllStudent();
    }, [])


    useEffect(() => {

        fetchAllStudent().then((result: any) => {
            if (result?.statusCode === 200) {
                setListStudent(result?.data?.users)
                console.log("STUDENT: " + JSON.stringify(result?.data?.users))
            }
            else {
                // thông báo lỗi // 
            }
        })
            .catch((err: any) => {
                // thông báo lỗi
            })

    }, [])

    return (
        <div className={styles.registerTopic}>
            <div className={styles.mainRegister}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                    <h2 className={styles.titleForm}>Thông tin đề tài</h2>
                    <div className={`${styles.row1} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Tên đề tài </p>
                            <input defaultValue={"ĐỀ TÀI QUẢN LÍ KHOÁ LUẬN TỐT NGHIỆP"}  {...register("topic")} />
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Giáo viên hướng dẫn </p>
                            <input defaultValue={"Nguyễn Minh Đạo"}  {...register("teacher")} />
                        </div>
                    </div>
                    <div className={`${styles.row2} `}>
                        <div className={styles.item}>
                            <p className={styles.label}>Yêu cầu đề tài</p>
                            <textarea defaultValue={"ĐỀ TÀI QUẢN LÍ KHOÁ LUẬN TỐT NGHIỆP"}  {...register("description")} />
                        </div>
                    </div>
                    <div className={`${styles.row3} item-btw w-100`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Sinh viên 1</p>
                            <select className={styles.select}  {...register("student_id1")} >
                                {
                                    listStudent.length > 0 ? listStudent.map((value1: any, index: number) => {
                                        return <option key={`student${index}`} value={value1?._id}>{value1?.user_name}</option>
                                    }) : <></>
                                }
                            </select>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Sinh viên 2</p>
                            <select className={styles.select} {...register("student_id2")} >
                                {
                                    listStudent.length > 0 ? listStudent.map((value1: any, index: number) => {
                                        return <option key={`student${index}`} value={value1?._id}>{value1?.user_name}</option>
                                    }) : <></>
                                }
                            </select>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Sinh viên 3</p>
                            <select className={styles.select}  {...register("student_id3")} >
                                {
                                    listStudent.length > 0 ? listStudent.map((value1: any, index: number) => {
                                        return <option key={`student${index}`} value={value1?._id}>{value1?.user_name}</option>
                                    }) : <></>
                                }
                            </select>
                        </div>
                    </div>
                    <div className={styles.row4}>
                        <button className={styles.btnRegister}> Đăng kí đề tài </button>
                    </div>
                </form>
            </div>

        </div>

    )
}

export default RegisterTopic