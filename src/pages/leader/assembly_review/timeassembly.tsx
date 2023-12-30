import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/time-assembly.module.scss'
import AssemblyAPI from '@/apis/student/assembly.api'
import { Dialog } from 'primereact/dialog'
import TopicStudentAPI from '@/apis/student/topic.api'
import { Link } from 'react-router-dom'
import useStorage from '@/hooks/useStorage'
import TopicTeacherApi from '@/apis/teacher/topic.api'
import axios from "axios"
import { BASE_API_URL } from "@/utils/globalVariables"
import { getToken } from "@/hooks/useGetToken"
import LeaderFormAssembly from "./formassembly"

interface ILeaderTimeAssemblyProps {
  handleClose: () => void
  openDialog: boolean
  assemblyId: string | undefined
  topicId: string | undefined
}

const LeaderTimeAssembly: React.FC<ILeaderTimeAssemblyProps> = ({ handleClose, openDialog, assemblyId, topicId }) => {
  const headers = getToken("token")
  const [idStudent, setIdStudent] = useState<string>("");
  const [grader, setGrader] = useState<string>("");
  const [openResultMentor, setResultMentor] = useState<any>(false)

  const [assembly, setAssembly] = useState<any>(null)
  const [topicDetail, setTopicDetail] = useState<any>(null)

  const handleCloseResultMentor = () => {
    setResultMentor(false)
  }

  const handleOpenResultMentor = (userId: any, grader: any) => {
    setResultMentor(true)
    setIdStudent(userId)
    setGrader(grader)
  }

  const fetchAssembly = useCallback(async () => {
    const response = await axios.get(`${BASE_API_URL}/assembly/findById/${assemblyId}`, { headers })
    console.log("response1", response);
    if (response.data.statusCode == 200) {
      setAssembly(response.data.data.assembly)
    }
  }, [assemblyId])

  const fetchDetailTopic = useCallback(async () => {
    const response = await axios.get(`${BASE_API_URL}/topics/leader/findById/${topicId}`, { headers })
    console.log("response2", response);
    if (response.data.statusCode == 200) {
      setTopicDetail(response.data.data.topic)
    }
  }, [topicId])

  useEffect(() => {
    fetchAssembly()
    fetchDetailTopic()
  }, [fetchAssembly, fetchDetailTopic])

  let userLocal: any = useStorage.GetLocalStorage("user");

  let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

  console.log("Data user:" + JSON.stringify(userOptionSelectDefault));

  return (
    <>
      <Dialog
        header="Thông tin hội đồng phản biện"
        visible={openDialog}
        onHide={handleClose}
        style={{ width: '100%', height: '100vh', overflow: 'hidden', maxHeight: "unset" }}
      >
        {assemblyId ? <>
          <div className={`${styles.body}`}>
            <div className={styles.groupLocation} style={{ gap: "0.5rem" }}>
              <div className={styles.locationItem}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-calendar-days"></i> Ngày phản biện:
                </span>
                <div>
                  {topicDetail ? topicDetail?.topic_date : ""}
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-clock"></i> Giờ phản biện:
                </span>
                <div>
                  {topicDetail ? topicDetail?.topic_time_start : ""} -  {topicDetail ? topicDetail?.topic_time_end : ""}
                </div>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.icon}>
                  <i className="fa-solid fa-location-dot"></i> Phòng:
                </span>
                <div>
                  {topicDetail ? topicDetail?.topic_room : ""}
                </div>
              </div>
            </div>
            <div className={`${styles.assembly} item-btw`}>
              <div className={`${styles.mainPerson} item-btw`}>
                <div className={`${styles.personItem} item-btw`}>
                  <div className={`${styles.imageIcon}`}>
                    <img src={assembly && assembly?.chairman ? assembly?.chairman?.user_avatar : "/public/avatar.jpg"} alt="" />
                  </div>
                  <div className={`${styles.content} w-80`}>
                    <p className={styles.role}>Chủ tịch</p>
                    <p className={styles.name}>{assembly && assembly?.chairman ? assembly?.chairman?.user_name : ""}</p>
                    {/* <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3`} target='_blank'>Điểm số</Link></p> */}
                  </div>
                </div>

                <div className={`${styles.personItem} item-btw`}>
                  <div className={`${styles.imageIcon}`}>
                    <img src={assembly && assembly?.secretary ? assembly?.secretary?.user_avatar : "/public/avatar.jpg"} alt="" />
                  </div>
                  <div className={`${styles.content} w-80`}>
                    <p className={styles.role}>Thư ký</p>
                    <p className={styles.name}>{assembly && assembly?.secretary ? assembly?.secretary?.user_name : ""}</p>
                    {/* <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3`} target='_blank'>Điểm số</Link></p> */}
                  </div>
                </div>
                {
                  assembly && assembly?.members.length > 0 ? assembly?.members.map((value: any, index: number) => {
                    return <div className={`${styles.personItem} item-btw`}>
                      <div className={`${styles.imageIcon} w-10`}>
                        <img src={value?.user_avatar ? value?.user_avatar : "public/avatar.jpg"} alt="" />
                      </div>
                      <div className={`${styles.content} w-80`}>
                        <p className={styles.role}>Uỷ viên</p>
                        <p className={styles.name}>{value?.user_name}</p>
                        {/* <p className={styles.score}><Link to={`/preview-score?topicId=${idTopic}&rubric=3`} target='_blank'>Điểm số</Link></p> */}
                      </div>
                    </div>
                  }) : <></>
                }

              </div>

              <div className={`${styles.groupMember} item-btw`} >

              </div>

            </div>
            <div className={styles.thamKhao}>
              <table className={`${styles.tableStudent} w-full`}>
                <tr className={styles.tr}>
                  <th className={`${styles.th} ${styles.titleTable}`}>Sinh viên/Giảng viên</th>
                  <th className={`${styles.th} ${styles.titleTable}`}>{assembly && assembly?.chairman ? assembly?.chairman?.user_name : ""}</th>
                  <th className={`${styles.th} ${styles.titleTable}`}>{assembly && assembly?.secretary ? assembly?.secretary?.user_name : ""}</th>

                  {
                    assembly && assembly?.members.length > 0 ? assembly?.members.map((value: any, index: number) => {
                      return <th className={`${styles.th} ${styles.titleTable}`}>{value?.user_name}</th>
                    }) : <></>
                  }
                </tr>
                {
                  topicDetail && topicDetail?.topic_group_student[0]?.group_member?.length > 0 ?
                    topicDetail?.topic_group_student[0]?.group_member.map((value: any, index: number) => {
                      return <tr key={"titlename" + index} className={styles.tr}>
                        <td className={`text-start ${styles.td}`} style={{ padding: "6px 10px", fontWeight: "bold" }}>
                          <p> {value?.user_name} - {value?.user_id} </p>
                        </td>
                        <td className={`${styles.td} text-center`} >
                          <div className={`${styles.styleScore} item-center`}>
                            <span className={`${styles.circle} item-center`}>
                              <i onClick={() => {
                                setGrader(assembly?.chairman?._id)
                                setResultMentor(true)
                                setIdStudent(value?._id)
                              }} className="pi pi-eye" style={{ cursor: "pointer" }}></i>
                            </span>
                          </div>
                        </td>
                        <td className={`${styles.td} text-center`}>
                          <div className={`${styles.styleScore} item-center`}>
                            <span className={`${styles.circle} item-center`}>
                              <i className="pi pi-eye" style={{ cursor: "pointer" }} onClick={() => {
                                setGrader(assembly?.secretary?._id)
                                setResultMentor(true)
                                setIdStudent(value?._id)
                              }}></i>
                            </span>
                          </div>
                        </td>
                        {
                          assembly && assembly?.members.length > 0 ? assembly?.members.map((value2: any, index: number) => {
                            return <td className={`${styles.td} text-center `}>
                              <div className={`${styles.styleScore} item-center`}>
                                <span className={`${styles.circle} item-center`}>
                                  <i className="pi pi-eye" style={{ cursor: "pointer" }} onClick={() => {
                                    setGrader(value2?._id)
                                    setResultMentor(true)
                                    setIdStudent(value?._id)
                                  }} ></i>
                                </span>
                              </div>
                            </td>
                          }) : <></>
                        }
                      </tr>
                    })
                    : <></>
                }
              </table>
            </div>
          </div>
        </> : <div className={styles.NotFoundAssembly}>
          <p className={styles.title}>Oops !</p>
          <p className={styles.content}> Nhóm này chưa được phân hội đồng phản biện &nbsp; <i className="fa-solid fa-triangle-exclamation"></i></p>
          <p className={styles.note}> Vui lòng đợi giáo vụ cập nhật thêm</p>
          <button className={styles.close} onClick={handleClose}>Đóng lại</button>
        </div>}

        {openResultMentor ? <LeaderFormAssembly topic={topicDetail} handleClose={handleCloseResultMentor} id={idStudent} grader={grader} /> : <></>}
      </Dialog >
    </>
  )
}

export default LeaderTimeAssembly