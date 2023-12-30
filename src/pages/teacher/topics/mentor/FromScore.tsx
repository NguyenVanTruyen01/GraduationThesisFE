import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/result-mentor.module.scss'
import ScoreAPI from '@/apis/student/score.api'
import ScoreTeacherAPI from '@/apis/teacher/score.api'
import { toast } from 'react-hot-toast'
import useStorage from '@/hooks/useStorage'
import Caculator from '@/utils/Caculator'
const FromScore = (props: any) => {

    const [scoreInfos, setScoreInfos] = useState<any>([])

    const [topic, setTopic] = useState<any>(null)

    const [student, setStudent] = useState<any>(null)

    const [grade, setGrade] = useState<any>(null)

    const [topicIdScore, setTopicIdScore] = useState<any>(null)

    console.log("topic:" + JSON.stringify(props?.topic))
    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null


    const filter = {
        "filter": {
            "rubric_category": 1,
            "student_id": props?.id,
            "topic_id": props?.topic?._id,
            "grader": userOptionSelectDefault?._id
        }
    }


    const handleScoreChange = (index: number, newScore: any) => {
        // Create a new array with updated scores
        const newScoreInfos = scoreInfos.map((item: any, idx: number) => {
            if (index === idx) {
                return { ...item, evaluation_score: newScore };
            }
            return item;
        });

        // Update the state
        setScoreInfos(newScoreInfos);

    };



    const fetchScore = useCallback(async () => {
        return await ScoreTeacherAPI.getScore(filter)
    }, [])

    const updateScoreCallback = useCallback(async (data: any) => {
        return await ScoreTeacherAPI.updateScore(data)
    }, [])


    const handleSubmit = () => {

        let arrayScore = document.querySelectorAll('.score');

        let evaluation = document.querySelectorAll('.evaluation');

        let listRequest = []
        for (let i = 0; i < arrayScore.length; i++) {

            let data = {
                evaluation_score: Number(arrayScore[i].getAttribute("value")),
                evaluation_id: evaluation[i].getAttribute("value")

            }
            listRequest.push(data)

        }

        let dataUpdateScore = {
            student_id: topicIdScore,
            data: {
                total_score: Caculator.CalculatorSpkt(scoreInfos),
                rubric_student_evaluations: listRequest
            }
        }

        updateScoreCallback(dataUpdateScore).then((result: any) => {

            if (result?.statusCode === 200) {
                toast.success(result?.message);
            }
            else {
                toast.error(result?.message);
            }

        })
            .catch((err: any) => {
                toast.error("Hệ thống đang nâng cấp thêm tính năng. ");
            })

    }


    useEffect(() => {
        fetchScore().then((result: any) => {
            if (result?.statusCode === 200) {
                setScoreInfos(result?.data?.rubrics?.rubric_student_evaluations)
                setTopic(result?.data?.rubrics?.topic_id)
                setTopicIdScore(result?.data?.rubrics?._id)
                setStudent(result?.data?.rubrics?.student_id)
            }
        })
    }, [])

    return (
        <div className={`${styles.resultMentor} item-center pb-5`}>
            <div className={styles.resultMentorMain}>
                <div className={`${styles.resultMentorHeader} item-end`}>
                    <i className="fa-solid fa-xmark" onClick={props?.handleClose}></i>
                </div>
                <div className={styles.resultMentorBody}>

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
                        <p className={styles.lineItem}> <span className={styles.nameItemSection}>Tên đề tài:</span> <span className={styles.nameItemContent}>{topic !== null ? topic?.topic_title : ""}</span> </p>
                        <p className={styles.lineItem}><span className={styles.nameItemSection}>Sinh viên thực hiện: </span></p>

                        <table className={styles.tableStudent}>
                            <tr className={styles.tr}>
                                <th className={styles.th}>Tên sinh viên</th>
                                <th className={styles.th}>Mã số sinh viên</th>
                            </tr>
                            <tr className={styles.tr}>
                                <td className={`text-center ${styles.td}`}>{student ? student?.user_name : ""}</td>
                                <td className={`text-center ${styles.td}`}>{student ? student?.user_id : ""}</td>
                            </tr>
                        </table>

                    </div>

                    <div className={`${styles.namePaper} text-center`}>
                        <h3 className={styles.titleSession}>ĐIỂM CHI TIẾT</h3>

                        <table className={styles.tableStudent}>
                            <tr className={styles.tr}>
                                <th className={styles.th}>STT</th>
                                <th className={styles.th}>NỘI DUNG</th>
                                <th className={styles.th}>THANG ĐIỂM</th>
                                <th className={styles.th}>TRỌNG SỐ</th>
                                <th className={styles.th}>ĐIỂM</th>
                            </tr>
                            {
                                scoreInfos && scoreInfos?.length > 0 ? scoreInfos.map((value: any, index: number) => {
                                    return (<tr key={"titlename" + index} className={styles.tr}>
                                        <td className={`text-center ${styles.td} ${styles.stt}`}>{index + 1}</td>
                                        <td className={`text-start ${styles.td}`} style={{ padding: "6px 10px" }}>{value?.evaluation_id?.evaluation_criteria} <input className="evaluation" type='hidden' value={value?.evaluation_id?._id} /></td>
                                        <td className={` ${styles.td} ${styles.stt}`}>{value?.evaluation_id?.grading_scale}</td>
                                        <td className={` ${styles.td} ${styles.stt}`}>{value?.evaluation_id?.weight}%</td>
                                        <td className={` ${styles.td} ${styles.stt}`}>
                                            <input
                                                type="number"
                                                min={"0"}
                                                max={`${value?.evaluation_id?.grading_scale ? value?.evaluation_id?.grading_scale : 10}`}
                                                value={value?.evaluation_score ? value?.evaluation_score : ""}
                                                onChange={(e) => handleScoreChange(index, e.target.value)}
                                                className="score text-center" placeholder='Nhập điểm'
                                                onInput={(e: any) => {
                                                    // Xóa các ký tự không phải số
                                                    e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                                    //Kiểm tra giá trị không lớn hơn grading_scale
                                                    const maxValue = value?.evaluation_id?.grading_scale || 10;
                                                    if (parseInt(e.target.value, 10) > maxValue) {
                                                        e.target.value = maxValue; // Nếu lớn hơn, đặt lại giá trị là maxValue
                                                    }

                                                    handleScoreChange(index, e.target.value);
                                                }}
                                            />
                                        </td>
                                    </tr>)
                                }) : <></>
                            }

                            <tr className={styles.tr}>
                                <td className={`${styles.td} font-bold`}>Tổng điểm</td>
                                <td className={`${styles.td}`} colSpan={3}></td>
                                <td className={`${styles.td} font-bold`}>{Caculator.CalculatorSpkt(scoreInfos)}</td>
                            </tr>

                        </table>
                    </div>

                    <div className={`${styles.mentorName} item-btw`}>
                        <div></div>
                        <div className={styles.info}>
                            <p className={`${styles.city} font-bold`}>Giảng viên chấm điểm</p>
                            <p className={styles.name}>{userOptionSelectDefault?.user_name}</p>
                        </div>

                    </div>

                    <div className={`${styles.mentorName} item-end`}>

                        <button className={styles.btnSave} onClick={handleSubmit}>Lưu thay đổi</button>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default FromScore