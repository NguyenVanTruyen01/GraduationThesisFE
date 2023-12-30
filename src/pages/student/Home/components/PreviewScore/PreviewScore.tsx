import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/preview-score.module.scss'
import { useLocation, useParams } from 'react-router-dom'
import useStorage from '@/hooks/useStorage'
import ScoreAPI from '@/apis/student/score.api'
import NotFoundRecord from '../../../../../assets/images/not_found.png'
import TopicStudentAPI from '@/apis/student/topic.api'
import moment from 'moment'

const PreviewScore = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const topicId = queryParams.get('topicId');
    const rubric = queryParams.get('rubric');
    const grader = queryParams.get('grader');

    const [scoreInfos, setScoreInfos] = useState<any>(null)
    const [topic, setTopic] = useState<any>(null)

    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    const fetchScore = useCallback(async () => {
        const filter = {
            filter: {
                topic_id: topicId,
                rubric_category: Number(rubric),
                student_id: userOptionSelectDefault?._id,
                grader: grader
            }
        }
        return await ScoreAPI.getScore(filter)
    }, [])

    const fetchDetailTopic = useCallback(async () => {
        return await TopicStudentAPI.fetchDetailTopic(topicId)
    }, [])


    useEffect(() => {

        fetchScore().then((result: any) => {
            if (result?.statusCode === 200) {
                setScoreInfos(result?.data?.rubrics)
            }

        });

        fetchDetailTopic().then((result: any) => {
            if (result?.statusCode === 200) {
                setTopic(result?.data?.topic)
            }
        });

    }, [])

    return (
        <div className={`${styles.resultMentor} item-center`}>
            <div className={styles.resultMentorMain}>
                <div className={`${styles.resultMentorHeader} item-end`}>
                </div>

                {
                    scoreInfos ?
                        <>
                            <div className={`${styles.header} item-btw text-base`}>
                                <div className={styles.headerLeft}>
                                    <p className={styles.nameSchool}>TRƯỜNG ĐẠI HỌC  XXX  THÀNH PHỐ HỒ CHÍ MINH</p>
                                    <p className={`${styles.nameFaculity} text-center`}>KHOA CÔNG NGHỆ THÔNG TIN </p>
                                </div>
                                <div className={`${styles.headerRight} text-base`}>
                                    <p className={styles.nameSchool}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                                    <p className={`${styles.nameSchool} text-center`}>Độc lập - Tự do - Hạnh phúc</p>
                                </div>
                            </div>

                            <div className={`${styles.namePaper} text-center`}>
                                <h3 className={styles.titleSession}>PHIẾU ĐÁNH GIÁ KHOÁ LUẬN TỐT NGHIỆP</h3>
                            </div>

                            <div className={styles.infoTopic}>

                                <p className={styles.lineItem}>
                                    <span className={styles.nameItemSection}>Tên đề tài:</span>
                                    <span className={styles.nameItemContent}>{topic !== null ? topic?.topic_title : ""}</span>
                                </p>

                                <p className={styles.lineItem}>
                                    <span className={styles.nameItemSection}>Ngày phản biện:</span>
                                    <span className={styles.nameItemContent}>
                                        {topic && topic?.topic_date ? moment(topic?.topic_date, 'YYYY-MM-DD').format('DD/MM/YYYY') : "Chưa có dữ liệu"}
                                    </span>
                                </p>

                                <p className={styles.lineItem}>
                                    <span className={styles.nameItemSection}>Giờ phản biện:</span>
                                    <span className={styles.nameItemContent}>
                                        {topic && topic?.topic_time_start ? topic?.topic_time_start : "_:_"} - {topic && topic?.topic_time_end ? topic?.topic_time_end : "_:_"}
                                    </span>
                                </p>

                                <p className={styles.lineItem}>
                                    <span className={styles.nameItemSection}>Địa điểm:</span>
                                    <span className={styles.nameItemContent}>
                                        {topic && topic?.topic_room ? topic?.topic_room : "Chưa có dữ liệu"}
                                    </span>
                                </p>

                                <p className={styles.lineItem}>
                                    <span className={styles.nameItemSection}>Hội đồng phản biện:</span>
                                    <span className={styles.nameItemContent}>
                                        {topic && topic?.topic_assembly ? topic?.topic_assembly?.assembly_name : "Chưa có dữ liệu"}
                                    </span>
                                </p>

                                <p className={styles.lineItem}><span className={styles.nameItemSection}>Sinh viên thực hiện: </span></p>
                                <table className={styles.tableStudent}>
                                    <tr className={styles.tr}>
                                        <th className={styles.th}>Tên sinh viên</th>
                                        <th className={styles.th}>Mã số sinh viên</th>
                                        <th className={styles.th}>Tổng điểm</th>
                                    </tr>
                                    <tr className={styles.tr}>
                                        <td className={`text-center ${styles.td}`}>{userOptionSelectDefault ? userOptionSelectDefault?.user_name : ""}</td>
                                        <td className={`text-center ${styles.td}`}>{userOptionSelectDefault ? userOptionSelectDefault?.user_id : ""}</td>
                                        <td className={`text-center ${styles.td} font-bold`}>{scoreInfos?.total_score}</td>
                                    </tr>
                                </table>

                            </div>

                            <div className={`${styles.mentorName} item-end`}>
                                <div>
                                    <p className={styles.mentorTitle}>Giảng viên chấm điểm</p>
                                    <p className={styles.nameProfile}>{scoreInfos?.grader.user_name}</p>
                                </div>

                            </div>
                        </>
                        :
                        <div className={`${styles.notFoundTopic} item-center`}>
                            <div className={styles.image}>
                                <img src={NotFoundRecord} alt="Not found" >
                                </img>
                                <div className={styles.noty} >CHƯA CÓ BẢNG ĐIỂM!</div>
                            </div>
                        </div>

                }

            </div >
        </div >
    )
}

export default PreviewScore