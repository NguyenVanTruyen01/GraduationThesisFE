import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/time-assembly.module.scss'
import AssemblyAPI from '@/apis/student/assembly.api'
import { Dialog } from 'primereact/dialog'
import TopicStudentAPI from '@/apis/student/topic.api'
import { Link } from 'react-router-dom'
import useStorage from '@/hooks/useStorage'
import moment from 'moment'


const TimeAssembly = (props: any) => {

    let idAssembly = props?.assemblyId

    let idTopic = props?.topicId

    let [assembly, setAssembly] = useState<any>(null)

    const [topicDetail, setTopicDetail] = useState<any>(null)

    let fetchAssemblyAPI = useCallback(async () => {
        return await AssemblyAPI.getAssembly(idAssembly)
    }, [])
    const fetchDetailTopic = useCallback(async () => {
        return await TopicStudentAPI.fetchDetailTopic(idTopic);
    }, [])


    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    console.log("Data user:" + JSON.stringify(userOptionSelectDefault));

    useEffect(() => {

        fetchAssemblyAPI().then((result: any) => {

            if (result?.statusCode === 200) {
                setAssembly(result?.data?.assembly);
            }
        })
        fetchDetailTopic().then((result: any) => {
            if (result?.statusCode === 200) {

                console.log("Topic detail:" + result?.data?.topic)
                setTopicDetail(result?.data?.topic)
            }

        })

    }, [])

    return (
        <Dialog
            header="Thông tin hội đồng phản biện"
            visible={props.openDialog}
            onHide={props.handleClose}
            style={{ width: '50rem', height: '50rem', overflow: 'hidden' }}
        >
            <div className={`${styles.body}`}>

                <div className={styles.groupLocation}>
                    <div className={styles.locationItem}>
                        <span className={styles.icon}>
                            <i className="fa-solid fa-calendar-days text-blue-500"></i> Ngày phản biện:
                        </span>
                        <div>
                            {topicDetail && topicDetail?.topic_date ? moment(topicDetail?.topic_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : "Chưa có dữ liệu"}
                        </div>
                    </div>
                    <div className={styles.locationItem}>
                        <span className={styles.icon}>
                            <i className="fa-solid fa-clock text-orange-500"></i> Giờ phản biện:
                        </span>
                        <div>
                            {topicDetail && topicDetail?.topic_time_start ? topicDetail?.topic_time_start : "_:_"} - {topicDetail && topicDetail?.topic_time_end ? topicDetail?.topic_time_end : "_:_"}
                        </div>
                    </div>
                    <div className={styles.locationItem}>
                        <span className={styles.icon}>
                            <i className="fa-solid fa-location-dot text-green-500"></i> Địa điểm:
                        </span>
                        <div>
                            {topicDetail && topicDetail?.topic_room ? topicDetail?.topic_room : "Chưa có dữ liệu"}
                        </div>
                    </div>


                    {
                        userOptionSelectDefault && userOptionSelectDefault?.role === "TEACHER" ?
                            <div className='item-start'>
                                <Link to={`/teacher/group/students/65648fa1535c107b65dafde1?topicID=${idTopic}`}><button className={styles.btnScore}>Chấm điểm</button></Link>
                            </div> :
                            <></>
                    }

                </div>

                <div className={`${styles.assembly} item-btw`}>

                    <div className={`${styles.assemblyTitle} text-lg text-center`}>
                        Hội đồng
                    </div>

                    {
                        assembly ?
                            <>
                                <div className={`${styles.mainPerson} item-btw`}>

                                    <div className={`${styles.personItem} item-btw`}>
                                        <div className={`${styles.imageIcon} w-30`}>
                                            <img src="/public/avatar.jpg" alt="" />
                                        </div>
                                        <div className={`${styles.content} w-80`}>
                                            <p className={styles.role}>Chủ tịch</p>
                                            <p className={styles.name}>{assembly && assembly?.chairman ? assembly?.chairman?.user_name : ""}</p>
                                            <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3&grader=${assembly?.chairman?._id}`} target='_blank'>Xem điểm</Link></p>
                                        </div>
                                    </div>

                                    <div className={`${styles.personItem} item-btw`}>
                                        <div className={`${styles.imageIcon} w-30`}>
                                            <img src="/public/avatar.jpg" alt="" />
                                        </div>
                                        <div className={`${styles.content} w-80`}>
                                            <p className={styles.role}>Thư ký</p>
                                            <p className={styles.name}>{assembly && assembly?.secretary ? assembly?.secretary?.user_name : ""}</p>
                                            <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3&grader=${assembly?.secretary?._id}`} target='_blank'>Xem điểm</Link></p>
                                        </div>
                                    </div>

                                </div>

                                <div className={`${styles.groupMember} item-btw`} >

                                    <div className={`${styles.assemblyTitle} text-center`}>
                                        Danh sách ủy viên
                                    </div>

                                    <div className={`${styles.listMember} text-center`}>
                                        {
                                            assembly && assembly?.members.length > 0 ? assembly?.members.map((value: any, index: number) => {
                                                return <div className={`${styles.memberItem} item-btw`}>
                                                    <div className={`${styles.imageIcon} w-30`}>
                                                        <img src={value?.user_avatar ? value?.user_avatar : "public/avatar.jpg"} alt="" />
                                                    </div>
                                                    <div className={`${styles.content} w-80`}>
                                                        <p className={styles.name}>{value?.user_name}</p>
                                                        <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3&grader=${value?._id}`} target='_blank'>Xem điểm</Link></p>
                                                    </div>
                                                </div>
                                            }) : <></>
                                        }


                                    </div>

                                </div>
                            </>
                            :
                            <div className={styles.noAssembly}>
                                CHƯA CÓ THÔNG TIN HỘI ĐỒNG!
                            </div>
                    }

                </div>

            </div>

        </Dialog >
    )
}

export default TimeAssembly