import { useCallback, useEffect, useState } from 'react'
import styles from './styles/detail-topic.module.scss'
import StudentAPI from '@/apis/student/student.api'
import { SubmitHandler, useForm } from 'react-hook-form'
import TopicStudentAPI from '@/apis/student/topic.api'
import { Link, useParams } from 'react-router-dom'
import Notify from '@/utils/Toast'
import Select from 'react-select';
import PeriodAPI from '@/apis/student/period.api'
import useStorage from '@/hooks/useStorage'
import { InputText } from 'primereact/inputtext'
import moment from 'moment'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import toast from 'react-hot-toast'
import React from 'react'

type Inputs = {
    student_id1: File | null;
    student_id2: File | null;
    student_id3: File | null;
    teacher: string,
    topic: string
    description: string
}

const DetailTopic = () => {

    const { id } = useParams()

    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    const [selectedOptionStudent1, setSelectedOptionStudent1] = useState<any>(null);
    const [selectedOptionStudent2, setSelectedOptionStudent2] = useState<any>(null);
    const [selectedOptionStudent3, setSelectedOptionStudent3] = useState<any>(null);

    const [period, setPeriodInfo] = useState<any>(null)

    const [selectedOptions, setSelectedOptions] = useState<any[]>([{
        value: userOptionSelectDefault?._id,
        label: userOptionSelectDefault?.user_name + " - " + userOptionSelectDefault?.user_id
    }, null, null]);

    const [listStudentOptions, setListStudentOptions] = useState<any[]>([]);

    const [topic, setTopic] = useState<any>(null)

    const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()

    const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
        try {

            let newGroupStudent = []
            if (selectedOptions.length > 0) {
                for (const x of selectedOptions) {
                    if (x?.value?.length > 0) {
                        newGroupStudent.push(x?.value)
                    }

                }
            }
            else {
                Notify("Bạn vui lòng chọn sinh viên làm đề tài ")
            }

            let newData = {
                id,
                group_student: newGroupStudent.filter((item) => item !== null && item.length > 0)
            }

            if (newData.group_student.length == 0) {
                Notify("Bạn vui lòng chọn sinh viên cần đăng kí")
            }

            const result: any = await TopicStudentAPI.registerTopic(newData);

            if (result?.statusCode === 200) {

                toast.success("Đăng kí đề tài thành  công.")
            }
            else {
                Notify("Đăng kí đề tài thất bại.")
            }

        } catch (error: any) {
            Notify(error.response?.data?.message);
        }

    }

    const [listStudent, setListStudent] = useState([])

    const [topicDetail, setTopicDetail] = useState<any>(null)

    const fetchAllStudent = useCallback(async () => {
        return await StudentAPI.getAllStudent();
    }, [])


    const fetchDetailTopic = useCallback(async () => {
        return await TopicStudentAPI.fetchDetailTopic(id);
    }, [])

    const fetchGetPeriod = useCallback(async () => {
        return await PeriodAPI.getPeriod();
    }, [])
    const fetchMyTopic = useCallback(async () => {
        return await TopicStudentAPI.fetchMyTopic();
    }, [])

    useEffect(() => {

        fetchDetailTopic().then((result: any) => {
            if (result?.statusCode === 200) {
                setTopicDetail(result?.data?.topic)
            }

        })
            .catch((error: any) => {
                Notify(`${error.response?.data?.message}`)
            })

        fetchAllStudent().then((result: any) => {
            if (result?.statusCode === 200) {
                setListStudent(result?.data?.users)

                if (result?.data?.users?.length > 0) {
                    let formatStudent: any = [];
                    for (const x of result?.data?.users) {
                        let item = { value: x?._id, label: x?.user_name + " - " + x?.email }

                        formatStudent.push(item);
                    }

                    setSelectedOptionStudent1(formatStudent)
                    setSelectedOptionStudent2(formatStudent)
                    setSelectedOptionStudent3(formatStudent)
                    setListStudentOptions(formatStudent);
                }
            }
            else {
                Notify(`${result?.message}`)
            }
        })
            .catch((error: any) => {
                Notify(`${error.response?.data?.message}`)
            })

        try {
            fetchGetPeriod().then((result: any) => {
                if (result?.statusCode === 200) {
                    setPeriodInfo(result?.data?.registration_period)
                    fetchMyTopic()
                        .then((result1: any) => {
                            console.log("Test 1:" + result1?.data?.topic[0])
                            if (result1?.statusCode == 200) {
                                setTopic(result1?.data?.topic[0])
                            }
                            else {
                                Notify("Hiện tại bạn chưa có đề tài đăng kí nào . ");
                            }
                        })
                        .catch((err: any) => {
                            //     console.log("Test notification:"+err.response?.data?.message)
                            //   Notify(`${err.response?.data?.message}`);
                        })
                }
                else {
                    Notify("Hiện tại chưa mở đợt đăng kí nào . Bạn vui lòng quay trở lại sau.");
                }
            })
                .catch((err: any) => {
                    Notify(`${err.response?.data?.message}`);
                })
        } catch (error) {
            Notify("Lỗi server đang bảo trì . Bạn vui lòng quay trở lại sau.Period");
        }


    }, [])

    return (
        <div className={styles.registerTopic}>
            <div className={`${styles.headerTopic} w-100 item-btw`}>
                <div className={styles.search}>
                    <h2 className="text-base text-900 font-bold">GHI DANH ĐỀ TÀI</h2>
                </div>
                <div className={`${styles.info} item-btw`}>

                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-spin pi-cog text-green-500"></i>
                        </span>
                        <InputText placeholder="Hoc ky"
                            disabled
                            className="text-sm"
                            value={period !== null ? period?.registration_period_semester?.semester + " - " + period?.registration_period_semester?.school_year_start + "/" + period?.registration_period_semester?.school_year_end : ""}
                        />
                    </div>

                    <div className="p-inputgroup flex-1">
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock text-green-500"></i>
                        </span>
                        <InputText
                            disabled
                            className="text-sm text-center"
                            value={moment(period?.registration_period_start, 'YYYYMMDD').format("DD/MM/YYYY")}
                        />
                    </div>

                    <div className="p-inputgroup flex-1">
                        <InputText
                            disabled
                            className="text-sm text-center"
                            value={moment(period?.registration_period_end, 'YYYYMMDD').format("DD/MM/YYYY")}
                        />
                        <span className="p-inputgroup-addon">
                            <i className="pi pi-clock text-orange-500"></i>
                        </span>
                    </div>

                </div>
            </div>

            <div className={styles.mainRegister}>
                <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>

                    <h2 className="text-base text-900 font-bold">THÔNG TIN ĐỀ TÀI</h2>

                    <div className={`${styles.row1} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Tên đề tài &nbsp; <i className="fa-regular fa-pen-to-square"></i></p>
                            <p>{topicDetail !== null ? topicDetail?.topic_title : ""}</p>
                        </div>
                    </div>

                    <div className={`${styles.row1} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Giảng viên hướng dẫn  &nbsp;<i className="fa-solid fa-user-tie"></i></p>
                            <p>{topicDetail !== null ? topicDetail?.topic_instructor?.user_name : ""}</p>
                        </div>
                    </div>

                    <div className={`${styles.row1} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Chuyên ngành</p>
                            <p>{topicDetail !== null ? topicDetail?.topic_major?.major_title : ""}</p>
                        </div>
                        <div className={styles.item}>
                            <p className={styles.label}>Loại đề tài</p>
                            <p>{topicDetail !== null ? topicDetail?.topic_category?.topic_category_title : ""}</p>
                        </div>
                    </div>

                    <div className={`${styles.row1} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Số lượng sinh viên thực hiện tối đa </p>
                            <p>{topicDetail !== null ? topicDetail?.topic_max_members : ""}</p>
                        </div>
                    </div>

                    <div className={`${styles.row2} item-btw`}>
                        <div className={styles.item}>
                            <p className={styles.label}>Yêu cầu đề tài  &nbsp; <i className="fa-regular fa-file-word"></i></p>
                            <textarea disabled defaultValue={`${topicDetail !== null ? topicDetail?.topic_description : ""}`}  {...register("description")} />
                        </div>
                    </div>

                    <div className={styles.bottom}>
                        <p className={styles.title}>Các nhóm đăng ký</p>
                        {
                            topicDetail?.topic_group_student && topicDetail?.topic_group_student.length > 1
                            && <div className={styles.warningManyGroup}>Có {topicDetail?.topic_group_student.length} nhóm đăng ký đề tài này. Giảng viên hướng dẫn sẽ liên hệ với các nhóm để tìm ra nhóm phù hợp thực hiện đề tài.</div>
                        }
                        <div className={styles.groupStudent}>
                            {
                                topicDetail?.topic_group_student && topicDetail?.topic_group_student.length > 0 ?
                                    <div>
                                        {
                                            topicDetail?.topic_group_student.map((group: any, index: number) => {
                                                return (
                                                    <div className={styles.group} key={index}>

                                                        <div className={styles.groupImg}>
                                                            <div className={styles.groupTitle}>
                                                                <p className={styles.groupName}> Nhóm {index + 1}</p>
                                                                <p className={styles.countMember}>Số lượng : {group.group_member.length}</p>
                                                            </div>
                                                        </div>

                                                        <div className={styles.groupContent}>
                                                            <div className={styles.members}>
                                                                {
                                                                    group && group.group_member.map((member: any) => {
                                                                        return (
                                                                            <p className={styles.lineStudent}>
                                                                                <i className="fa-solid fa-circle-dot"></i>
                                                                                <p className={styles.studentName} >{member.user_name}</p>
                                                                                <p className={styles.studentID} >{member.user_id}</p>
                                                                            </p>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )
                                        }
                                    </div>

                                    :
                                    <div className={styles.warningManyGroup}>Hiện tại chưa có sinh viên đăng ký đề tài này.</div>
                            }
                        </div>
                    </div>

                    <div className={`${styles.row3} item-btw w-100`}>
                        <div className={styles.item}>
                            {
                                topic === null &&
                                <p className={`${styles.label} text-orange-500`}>Đăng ký đề tài</p>
                            }
                            <div className={`${styles.students}`}>
                                {
                                    topic === null && Array.from({ length: topicDetail?.topic_max_members }).map((label, index) => (
                                        <div className={styles.item} key={index}>
                                            <p className={styles.label}>Sinh viên {index + 1}</p>
                                            <Select
                                                defaultValue={
                                                    index === 0 ? {
                                                        value: userOptionSelectDefault?._id,
                                                        label: userOptionSelectDefault?.user_name + " - " + userOptionSelectDefault?.user_id
                                                    } : selectedOptions[index]
                                                }
                                                isDisabled={index === 0}
                                                isClearable
                                                isSearchable
                                                onChange={value => {
                                                    const newOptions = [...selectedOptions];
                                                    newOptions[index] = value;
                                                    setSelectedOptions(newOptions);
                                                }}
                                                options={listStudentOptions}
                                                menuPlacement="top"
                                            />
                                        </div>
                                    ))
                                }
                            </div>

                        </div>
                    </div>
                    {
                        topic === null ?
                            <div className={styles.row4}>
                                <button className={styles.btnRegister}> Đăng kí đề tài </button>
                            </div>
                            :
                            <Link to="/student/topic"><button className={styles.btnCreate} ><i className="fa-solid fa-arrow-left"></i>&nbsp; Go Back </button></Link>
                    }

                </form>
            </div >

        </div >

    )
}

export default DetailTopic