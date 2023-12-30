import styles from './styles/result-assembly.module.scss'
import ScoreAPI from '@/apis/student/score.api'
import useStorage from '@/hooks/useStorage'
import { useCallback, useEffect, useState } from 'react'
import NotFoundRecord from '../../../../../assets/images/not_found.png'
import Loading from '@/components/loading/Loading'

const ResultAssembly = (props: any) => {

    const [loading, setLoading] = useState(true)

    const [scoreInfos, setScoreInfos] = useState<any>(null)

    const [myGroup, setmyGroup] = useState<any>([])

    const [student, setStudent] = useState<any>(null)

    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    const filter = {
        filter: {
            topic_id: props?.topic?._id,
            rubric_category: 2,
            student_id: userOptionSelectDefault?._id
        }
    }

    const fetchScore = useCallback(async () => {
        return await ScoreAPI.getScore(filter)
    }, [])


    useEffect(() => {
        fetchScore()
            .then((result: any) => {
                if (result?.statusCode === 200) {
                    setmyGroup(result?.data?.rubrics?.student_grades)
                    setScoreInfos(result?.data?.rubrics)
                    setStudent(result?.data?.rubrics?.student_id)
                }
                setLoading(false);
            })
            .catch((error: any) => {
                setLoading(false);
            })
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <div className={`${styles.resultMentor} item-center`}>
            <div className={styles.resultMentorMain}>
                <div className={`${styles.resultMentorHeader} item-end`}>
                    <i className="fa-solid fa-xmark" onClick={props?.handleClose}></i>
                </div>

                <div className={styles.resultMentorBody}>

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
                                    <h3 className={styles.titleSession}>PHIẾU ĐÁNH GIÁ ĐỒ ÁN TỐT NGHIỆP</h3>
                                </div>

                                <div className={styles.infoTopic}>
                                    <p className={styles.lineItem}> <span className={styles.nameItemSection}>Tên đề tài</span> :<span className={styles.nameItemContent}>{props?.topic !== null ? props?.topic?.topic_title : ""}</span> </p>
                                    <p className={styles.lineItem}><span className={styles.nameItemSection}>Sinh viên thực hiện </span>:</p>

                                    <table className={styles.tableStudent}>
                                        <tr className={styles.tr}>
                                            <th className={styles.th}>Tên sinh viên</th>
                                            <th className={styles.th}>Mã số sinh viên</th>
                                            <th className={styles.th}>Tổng điểm</th>
                                        </tr>
                                        <tr className={styles.tr}>
                                            <td className={`text-center ${styles.td}`}>{student ? student?.user_name : ""}</td>
                                            <td className={`text-center ${styles.td}`}>{student ? student?.user_id : ""}</td>
                                            <td className={`text-center ${styles.td} font-bold`}>{scoreInfos?.total_score}</td>
                                        </tr>
                                    </table>

                                </div>

                                <div className={`${styles.mentorName} item-end`}>
                                    <div>
                                        <p className={styles.mentorTitle}>Giảng viên phản biện</p>
                                        <p className={styles.nameProfile}>{props?.topic?.topic_reviewer?.user_name}</p>
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


                </div>


            </div>
        </div>
    )
}

export default ResultAssembly