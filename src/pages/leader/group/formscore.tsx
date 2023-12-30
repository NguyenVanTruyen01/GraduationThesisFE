import { useCallback, useEffect, useState } from 'react'
import styles from './styles/result-mentor.module.scss'
import { toast } from 'react-hot-toast'
import { ITopic, IUser } from "@/types/interface"
import axios from "axios"
import { BASE_API_URL } from "@/utils/globalVariables"
import { getToken } from "@/hooks/useGetToken"
import { Button } from "primereact/button"
import { downloadExcel } from "react-export-table-to-excel"

interface ILeaderFormScoreProps {
  topicDetail: ITopic | undefined
  handleClose: () => void
  studentId: string
  rubricCategory: number
}

const headers = getToken("token")

const LeaderFormScore: React.FC<ILeaderFormScoreProps> = ({ topicDetail, handleClose, studentId, rubricCategory }) => {
  const [scoreInfos, setScoreInfos] = useState<any>([])
  const [topic, setTopic] = useState<ITopic>()
  const [student, setStudent] = useState<IUser>()
  const [grader, setGrader] = useState<any>(null)
  const [topicIdScore, setTopicIdScore] = useState<any>(null)
  const [totalScore, setTotalScore] = useState<number>()
  const [topicsDataExport, setTopicsDataExport] = useState<any>()

  const filter = {
    "filter": {
      "rubric_category": rubricCategory,
      "student_id": studentId,
      "topic_id": topicDetail?._id
    }
  }

  const fetchStudentScore = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}/scoreboard/getByFilter`, filter, { headers })
      console.log("response", response);
      if (response.data.statusCode == 200) {
        toast.success(response.data.message)
        setScoreInfos(response.data.data.rubrics.rubric_student_evaluations)
        setTopic(response.data.data.rubrics.topic_id)
        setTopicIdScore(response.data.data.rubrics._id)
        setStudent(response.data.data.rubrics.student_id)
        setGrader(response.data.data.rubrics.grader)
        setTotalScore(response.data.data.rubrics.total_score)

        let newDataCustom = [];

        const resultStrings: string[] = [];

        for (const item of response.data.data.rubrics.rubric_student_evaluations) {
          const evaluationId = item.evaluation_id || {};
          const criteria = evaluationId.evaluation_criteria || "";
          const score = item.evaluation_score !== null ? item.evaluation_score.toString() : "";

          const resultString = `${criteria} - ${score}`;
          resultStrings.push(resultString);
        }

        const result = resultStrings.join(", ");


        newDataCustom.push([response.data.data.rubrics.topic_id?.topic_title, response.data.data.rubrics.grader?.user_name, response.data.data.rubrics.student_id?.user_name, response.data.data.rubrics.student_id?.user_id, result, response.data.data.rubrics.total_score]);
        setTopicsDataExport(newDataCustom);
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }, [topicDetail, studentId, rubricCategory])

  useEffect(() => {
    fetchStudentScore()
  }, [fetchStudentScore])

  const headerExport = ["Tên Đề Tài", "Người chấm", "Tên sinh viên", "MSSV", "Điểm đánh giá", "Tổng điểm"]
  const body2 = [
    { firstname: "Edison", lastname: "Padilla", age: 14 },
    { firstname: "Cheila", lastname: "Rodrigez", age: 56 },
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "bang_diem",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header: headerExport,
        // accept two different data structures
        body: topicsDataExport || body2,
      },
    });
  }

  return (
    <div className={`${styles.resultMentor} item-center `}>
      <div className={styles.resultMentorMain}>
        <div className={`${styles.resultMentorHeader} item-end`}>
          <i className="pi pi-times" onClick={handleClose}></i>
        </div>
        {
          scoreInfos?.length === 0 ? <p className={styles.notFoundRegisTopic}>Sinh viên chưa được chấm điểm</p> :
            <div className={styles.resultMentorBody}>
              <div className={`${styles.header} item-btw`}>
                <div className={styles.headerLeft}>
                  <p className={`${styles.nameFaculity} text-center`}>KHOA CÔNG NGHỆ THÔNG TIN </p>
                </div>
                <div className={styles.headerRight}>
                  <p className={styles.nameSchool}>Cộng hoà xã hội chủ nghĩa Việt Nam</p>
                  <p className={`${styles.nameSchool} text-center`}>Độc lập - Tự do - Hạnh phúc</p>
                </div>

              </div>
              <div className={`${styles.namePaper} text-center`}>
                <h3 className={styles.titleSession}>KẾT QUẢ ĐÁNH GIÁ KHOÁ LUẬN TỐT NGHIỆP</h3>
              </div>
              <div className={styles.infoTopic}>
                <p className={styles.lineItem}> <span className={styles.nameItemSection}>Tên đề tài</span> :<span className={styles.nameItemContent}>{topic !== null ? topic?.topic_title : ""}</span> </p>
                <p className={styles.lineItem}><span className={styles.nameItemSection}>Sinh viên thực hiện </span>:</p>

                <table className={`${styles.tableStudent} w-full`}>
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
              <div className={`text-center`}>
                <h3 className="mt-5 font-bold text-base text-center">ĐIỂM CHI TIẾT</h3>
                <table className={`${styles.tableStudent} w-full`}>
                  <tr className={styles.tr}>
                    <th className={styles.th}>STT</th>
                    <th className={styles.th}>NỘI DUNG</th>
                    <th className={styles.th}>THANG ĐIỂM</th>
                    <th className={styles.th}>TRỌNG SỐ</th>
                    <th className={styles.th}>ĐIỂM</th>
                  </tr>
                  {
                    scoreInfos?.length > 0 ? scoreInfos.map((value: any, index: number) => {
                      return (
                        <tr key={"titlename" + index} className={styles.tr}>
                          <td className={`text-center ${styles.td}`}>{index + 1}</td>
                          <td className={`text-start ${styles.td}`} style={{ padding: "6px 10px" }}>{value?.evaluation_id?.evaluation_criteria} <input className="evaluation" type='hidden' value={value?.evaluation_id?._id} /></td>
                          <td className={` ${styles.td}`}>{value?.evaluation_id?.grading_scale}</td>
                          <td className={` ${styles.td}`}>{value?.evaluation_id?.weight}%</td>
                          <td className={` ${styles.td}`}>{value?.evaluation_score ? value?.evaluation_score : ""}</td>
                        </tr>

                        )

                    }) : <></>
                  }
                  <tr className={styles.tr}>
                    <td className={`${styles.td} font-bold`}>Tổng điểm</td>
                    <td className={`${styles.td}`} colSpan={3}></td>
                    <td className={`${styles.td} font-bold`}>{totalScore}</td>
                  </tr>
                </table>
              </div>
            </div>
        }
        <div className="float-right">
          <h3 className="font-bold text-base">Người chấm: {grader?.user_name}</h3>
        </div>
        <div>
          {scoreInfos?.length > 0 && <Button className="" icon="pi pi-download" label="Tải xuống" size="small" onClick={handleDownloadExcel} />}
        </div>
      </div>
    </div>
  )
}

export default LeaderFormScore