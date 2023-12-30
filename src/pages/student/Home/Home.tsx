import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/home.module.scss'
import PeriodAPI from '@/apis/student/period.api'
import { useNavigate } from 'react-router-dom'
import TopicStudentAPI from '@/apis/student/topic.api'
import Notify from '@/utils/Toast'
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from '@/components/loading/Loading'
import ResultMentor from './components/ResultMentor/ResultMentor'
import ResultAssembly from './components/ResultAssembly/ResultAssembly'
import TimeAssembly from './components/TimeAssembly/TimeAssembly'
import Image from '@/components/image/Image'
import NotFoundRecord from '../../../assets/images/not_found.png'
import { SpeedDial } from 'primereact/speeddial';
import toast from 'react-hot-toast'
import { Button } from 'primereact/button'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

const Home = () => {

  const userToken = JSON.parse(localStorage.getItem('token') || '{}')
  const headers = {
    'Authorization': `${userToken}`,
    'Content-Type': 'multipart/form-data'
  }

  const [loading, setLoading] = useState(true)

  const [topic, setTopic] = useState<any>(null)

  const [reload, setReload] = useState<any>(false)

  const [openResultMentor, setResultMentor] = useState<any>(false)
  const [openResultAssembly, setOpenResultAssembly] = useState<any>(false)

  const [openTimeAssembly, setOpenTimeAssembly] = useState<any>(false)

  const [assembly, setAssembly] = useState<any>(null)

  const [advisorRequest, setAdvisorRequest] = useState<any>(null)
  const [defenseRequest, setDefenseRequest] = useState<any>(null)

  const [fileFinalReport, setFileFinalReport] = useState<any>(null)

  const fetchMyTopic = useCallback(async () => {
    return await TopicStudentAPI.fetchMyTopic();
  }, [])


  useEffect(() => {

    try {
      fetchMyTopic()
        .then((result1: any) => {
          if (result1?.statusCode == 200) {
            setLoading(false)

            setTopic(result1?.data?.topic[0])

            setAdvisorRequest({
              name: result1?.data?.topic[0]?.topic_advisor_request?.split('/')[1]
            })
            setDefenseRequest({
              name: result1?.data?.topic[0]?.topic_defense_request?.split('/')[1]
            })
            setFileFinalReport({
              name: result1?.data?.topic[0]?.topic_final_report?.split('/')[1]
            })
            setAssembly(result1?.data?.topic[0]?.topic_assembly?._id)
          }
          else {
            toast.error("Bạn chưa đăng ký đề tài nào!");
            setLoading(false)
          }
        }).catch((error) => {
          setLoading(false)
        })

    } catch (error) {
      toast.error(`Server đang bảo trì bạn vui lòng quay trở lại sau. `);
      setLoading(false)
    }

  }, [reload])


  const onFileChangeAdvisorRequest = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setAdvisorRequest(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const onFileChangeDefenseRequest = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setDefenseRequest(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const onFileChangeAddReport = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setFileFinalReport(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const handleCloseTimeAssembly = () => {
    setOpenTimeAssembly(false)
  }

  const handleOpenTimeAssembly = () => {
    setOpenTimeAssembly(true)
  }

  const handleCloseResultMentor = () => {
    setResultMentor(false)
  }

  const handleOpenResultMentor = () => {
    setResultMentor(true)
  }

  const handleCloseResultAssembly = () => {
    setOpenResultAssembly(false)
  }

  const handleOpenResultAssembly = () => {
    setOpenResultAssembly(true)
  }

  const handleUploadadVisorRequest = async (event: any) => {
    let formData = new FormData();
    formData.append('topic_file', advisorRequest);
    formData.append('topic_id', topic._id)
    formData.append('update_field', 'topic_advisor_request')

    await axios.post(`${BASE_API_URL}/topics/student/uploadFile`, formData, { headers })
      .then(result => {
        setReload(!reload)
        Notify("Tải lên đơn xin hướng dẫn khóa luận thành công !");
      }).catch(err => {
        Notify("Tải lên đơn xin hướng dẫn khóa luận thất bại !");
      })
  }

  const handleUploadadDefenseRequest = async (event: any) => {
    let formData = new FormData();
    formData.append('topic_file', defenseRequest);
    formData.append('topic_id', topic._id)
    formData.append('update_field', 'topic_defense_request')


    await axios.post(`${BASE_API_URL}/topics/student/uploadFile`, formData, { headers })
      .then(result => {
        setReload(!reload)
        Notify("Tải lên đơn xin bảo vệ khóa luận thành công !");
      }).catch(err => {
        Notify("Tải lên đơn xin bảo vệ khóa luận thất bại !");
      })

  }

  const handleUploadAddReport = async (event: any) => {
    let formData = new FormData();
    formData.append('topic_file', fileFinalReport);
    formData.append('topic_id', topic._id)
    formData.append('update_field', 'topic_final_report')


    await axios.post(`${BASE_API_URL}/topics/student/uploadFile`, formData, { headers })
      .then(result => {
        setReload(!reload)
        Notify("Tải lên file  thành công !");
      }).catch(err => {
        Notify("Tải lên đơn xin bảo vệ khóa luận thất bại !");
      })

  }

  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false)
  const [infoUser, setInfoUser] = useState<any>(null)

  const handleOpenMoreInfo = (data: any) => {
    setOpenMoreInfo(true);

    setInfoUser(data);
  }
  const handleCloseMoreInfo = (data: any) => {
    setOpenMoreInfo(false);
  }

  const cancelMyTopic = useCallback(async (topic: any) => {

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    // Tìm group của sinh viên muốn hủy đề tài
    const foundGroup = topic?.topic_group_student.find((group: any) => {
      // Kiểm tra mỗi thành viên trong group_member
      return group.group_member.some((member: any) => member._id === currentUser._id);
    });

    if (foundGroup) {
      const data = {
        topic_id: topic._id,
        group_student_id: foundGroup._id
      }

      return await TopicStudentAPI.cancelTopic(
        data
      );
    }


  }, [])

  const cancelTopicFunc = async (topic: any) => {

    cancelMyTopic(topic).then((result: any) => {
      if (result?.statusCode === 200) {
        toast.success("Hủy đăng ký đề tài thành công!")
        setReload(!reload)
        setTopic(null)
      }
    })
      .catch((error: any) => {
        toast.error(`${error.response?.data?.message}`)
      });
  }


  const reject = () => {
    return;
  };

  const cancelTopic = (event: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Bạn chắc chắn muốn hủy đăng ký đề tài này?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => await cancelTopicFunc(topic),
      reject
    });
  };

  const deleteMyTopic = useCallback(async (topic: any) => {

    return await TopicStudentAPI.deleteSuggestTopic(
      topic._id
    );

  }, [])

  const deleteTopicFunc = async (topic: any) => {

    deleteMyTopic(topic).then((result: any) => {
      if (result?.statusCode === 200) {
        toast.success("Xóa đăng ký đề tài thành công!")
        setReload(!reload)
        setTopic(null)
      }
    })
      .catch((error: any) => {
        toast.error(`${error.response?.data?.message}`)
      });
  }

  const deleteTopic = (event: any) => {
    confirmPopup({
      target: event.currentTarget,
      message: 'Bạn chắc chắn muốn xóa đăng ký đề tài này?',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: async () => await deleteTopicFunc(topic),
      reject
    });
  };

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={styles.mainHome}>
      {
        topic ?
          <div className={styles.mainLayout}>

            <div className={styles.topicDetail}>

              <div className={styles.top}>
                <p className={styles.title}>THÔNG TIN ĐỀ TÀI ĐÃ ĐĂNG KÝ</p>
                <ConfirmPopup />
                <div className={`${styles.header}  w-100`}>
                  <span className={`${styles.label} ${styles.topic_title}`}>
                    <div>
                      Tên đề tài
                    </div>
                    {
                      topic &&
                      topic?.topic_teacher_status === "READY" &&
                      <Button onClick={cancelTopic} icon="pi pi-times" label="Hủy đăng ký" className={`${styles.cancelTopic} p-button-danger p-button-outlined`}></Button>
                    }

                    {
                      topic &&
                      topic?.topic_teacher_status === "PENDING" &&
                      < Button onClick={deleteTopic} icon="pi pi-times" label="Hủy đề tài" className={`${styles.cancelTopic} p-button-danger p-button-outlined`}></Button>
                    }

                  </span>
                  <p className={`${styles.nameTopic}`}>
                    <span className={styles.label}>
                      <i className="fa-solid fa-bookmark"></i> &nbsp;</span>{topic !== null ? topic?.topic_title : ""}
                  </p>
                </div>

                <div className={styles.groupInstructor}>
                  <div className={`${styles.imageInstructor} item-btw`}>
                    <p className={`${styles.title}`}>
                      Giảng viên hướng dẫn
                      <i onClick={() => handleOpenMoreInfo(topic?.topic_instructor)} className="fa-regular fa-credit-card px-5 cursor-pointer text-blue-400"></i>
                    </p>

                    {
                      topic &&
                      (
                        topic?.topic_teacher_status === 'REGISTERED' ||
                        topic?.topic_teacher_status === 'COMPLETED'
                      ) &&
                      <button onClick={handleOpenResultMentor} className={styles.downloadResult}>Xem điểm</button>
                    }

                  </div>
                  <p className={styles.nameInstructor}>
                    {topic !== null ? <div>{topic?.topic_instructor?.user_name}</div> : ""}
                  </p>
                </div>

                <div className={`${styles.group_cate}`}>
                  <div className={`${styles.item}`}>
                    <div className={`${styles.title}`}>Chuyên ngành</div>
                    <div className={`${styles.topic_major}`}>{topic?.topic_major.major_title}</div>
                  </div>

                  <div className={`${styles.item}`}>
                    <div className={`${styles.title}`}>Loại đề tài</div>
                    <div className={`${styles.category}`}>{topic?.topic_category.topic_category_title}</div>
                  </div>

                </div>



                <p className={styles.describe}>
                  <span className={styles.label}>Chi tiết đề tài</span>
                </p>
                <textarea disabled auto-height className={`${styles.text} text-sm`} >
                  {topic !== null ? '" ' + topic?.topic_description + ' "' : ""}
                </textarea>

                <p className={styles.describe}>
                  <span className={styles.label}>
                    Tối đa sinh viên thực hiện:
                  </span>
                  <span className={`${styles.valueCount} text-sm`}>&nbsp; {topic !== null ? topic?.topic_max_members : ""}</span>
                </p>
              </div>

              <div className={styles.bottom}>
                <p className={styles.title}>Các nhóm đăng ký</p>
                {
                  topic.topic_group_student && topic.topic_group_student.length > 1
                  && <div className={styles.warningManyGroup}>Có {topic.topic_group_student.length} nhóm đăng ký đề tài này. Giảng viên hướng dẫn sẽ liên hệ với các nhóm để tìm ra nhóm phù hợp thực hiện đề tài.</div>
                }
                <div className={styles.groupStudent}>
                  {
                    topic.topic_group_student && topic.topic_group_student.length > 0 &&
                    topic.topic_group_student.map((group: any, index: number) => {
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
                    )}
                </div>
              </div>

            </div>

            {
              topic &&
              (
                topic?.topic_teacher_status === 'REGISTERED' ||
                topic?.topic_teacher_status === 'COMPLETED'
              ) &&

              <>

                <div className={styles.uploadFile}>

                  <div className={styles.groupFile}>

                    <div className={styles.title}>
                      <p>Tài liệu quan trọng</p>
                    </div>

                    <div className={styles.uploadComponent}>

                      <div className={styles.itemComponent}>
                        <p className={styles.documentName}>1. Đơn xin hướng dẫn khóa luận &nbsp;<a className={styles.templateFile}
                          href={`${BASE_API_URL}/system_file/don_xin_huong_dan_khoa_luan.docx`}
                          target="_blank"
                        >
                          <i className="fa-solid fa-arrow-down fa-bounce"></i>
                        </a></p>

                        {
                          (topic.topic_advisor_request || advisorRequest?.name) ?
                            <a className={styles.fileName}
                              href={`${BASE_API_URL}/${topic.topic_advisor_request} `}
                              target="_blank"
                            >
                              {advisorRequest.name}
                            </a>
                            :
                            <p className={styles.fileName}>Không có tệp nào.</p>
                        }


                        <div className={styles.chooseFile}>
                          <label className={styles.file} htmlFor="file">Chọn file</label>
                          <input id="file" type="file" onChange={onFileChangeAdvisorRequest} />
                          <button className={styles.btnUpload} onClick={handleUploadadVisorRequest}>Tải lên</button>
                        </div>

                      </div>

                      <div className={styles.itemComponent}>
                        <p className={styles.documentName}>2. Đơn xin bảo vệ khóa luận &nbsp;<a className={styles.templateFile}
                          href={`${BASE_API_URL}/system_file/mau_don_xin_bao_cao_khoa_luan.doc`}
                        >
                          <i className="fa-solid fa-arrow-down fa-bounce"></i>
                        </a></p>

                        {
                          topic.topic_defense_request || defenseRequest?.name ?
                            <a className={styles.fileName}
                              href={topic.topic_defense_request ? `${BASE_API_URL}/${topic.topic_defense_request} ` : ''}
                              target="_blank"
                            >
                              {defenseRequest.name}
                            </a>
                            :
                            <p className={styles.fileName}>Không có tệp nào.</p>
                        }

                        <div className={styles.chooseFile}>
                          <label className={styles.file} htmlFor="fileDefense1">Chọn file</label>
                          <input id="fileDefense1" type="file" onChange={onFileChangeDefenseRequest} />
                          <button className={styles.btnUpload} onClick={handleUploadadDefenseRequest}>Tải lên</button>
                        </div>

                      </div>
                      <div className={styles.itemComponent}>
                        <p className={styles.documentName}>3. Báo cáo cuối cùng</p>

                        {
                          topic.topic_final_report || fileFinalReport?.name ?
                            <a className={styles.fileName}
                              href={topic.topic_final_report ? `${BASE_API_URL}/${topic.topic_final_report} ` : ''}
                              target="_blank"
                            >
                              {fileFinalReport.name}
                            </a>
                            :
                            <p className={styles.fileName}>Không có tệp nào.</p>
                        }

                        <div className={styles.chooseFile}>
                          <label className={styles.file} htmlFor="fileDefense">Chọn file</label>
                          <input id="fileDefense" type="file" onChange={onFileChangeAddReport} />
                          <button className={styles.btnUpload} onClick={handleUploadAddReport}>Tải lên</button>
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

                <div className={styles.groupMark} >

                  <div className={styles.groupAssembly}>
                    <div className={styles.groupIn4Reviewer} >
                      <p className={`${styles.title} item-btw`}>
                        <span>Giảng viên phản biện &nbsp; &nbsp;<i className="fa-regular fa-credit-card cursor-pointer" onClick={() => handleOpenMoreInfo(topic?.topic_reviewer)}></i></span>
                        <button onClick={handleOpenResultAssembly} className={styles.downloadResult}>Xem điểm</button>
                      </p>

                      <p className={styles.nameReviewer}>
                        {topic !== null ?
                          <>
                            {topic?.topic_reviewer?.user_name}
                          </> : "Chưa có thông tin"}
                      </p>
                    </div>

                    <div className={styles.groupIn4Reviewer} >
                      <p className={`${styles.title} item-btw`}>
                        <span>Hội đồng phản biện</span>
                        {/* <button onClick={handleOpenResultMentor} className={styles.downloadResult}> Kết quả  </button> */}
                        <button onClick={handleOpenTimeAssembly} className={styles.downloadResult}> Thông tin hội đồng</button>
                      </p>
                      <p className={styles.nameReviewer}>  {topic?.topic_assembly?.assembly_name ? topic?.topic_assembly?.assembly_name : "Chưa có hội đồng chấm điểm"}</p>

                    </div>

                  </div>
                </div>

              </>


            }

          </div>
          :
          <div className={`${styles.notFoundTopic} item-center`}>
            <div className={styles.image}>
              <img src={NotFoundRecord} alt="Not found" >
              </img>
              <div className={styles.noty} >CHƯA ĐĂNG KÝ ĐỀ TÀI NÀO!</div>
            </div>
          </div>
      }

      {openResultMentor ? <ResultMentor handleClose={handleCloseResultMentor} topic={topic} name_profile={topic?.topic_instructor?.user_name} /> : <></>}
      {openResultAssembly ? <ResultAssembly handleClose={handleCloseResultAssembly} topic={topic} /> : <></>}

      {openTimeAssembly ? <TimeAssembly handleClose={handleCloseTimeAssembly} openDialog={openTimeAssembly} assemblyId={assembly} topicId={topic?._id} /> : <></>}

      {
        openMoreInfo ?
          <div className={styles.popupMoreInfo}>
            <div className={styles.mainMoreInfo}>

              <div className={`${styles.headerInfo} item-btw`}>
                <p className={styles.titlePopup}>Thông tin liên hệ</p>
                <p className={styles.close}><i className="fa-solid fa-xmark" onClick={handleCloseMoreInfo}></i></p>
              </div>

              <div className={`${styles.sectionImage} item-center w-100`}>
                <div className={styles.image}>
                  {
                    infoUser?.user_avatar && infoUser?.user_avatar.length > 0 ?
                      <Image image={infoUser?.user_avatar} />
                      :
                      <Image image={"https://www.businessnetworks.com/sites/default/files/default_images/default-avatar.png"} />
                  }
                </div>
                <p className={styles.line1}>
                  <i className="fa-regular fa-user"></i>&nbsp; &nbsp; &nbsp;{infoUser?.user_name}
                </p>
              </div>

              <div className={styles.content1}>
                <p className={styles.line1}>
                  <i className="fa-regular fa-envelope text-green-500"></i>&nbsp; &nbsp; &nbsp;{infoUser?.email}
                </p>
                <p className={styles.line1}>
                  <i className="fa-solid fa-phone text-green-500"></i>&nbsp; &nbsp; &nbsp;{infoUser?.user_phone}
                </p>
                <p className={styles.line1}>
                  Khoa:&nbsp; &nbsp; &nbsp;{infoUser?.user_faculty?.faculty_title}
                </p>
                <p className={styles.line1}>
                  Chuyên ngành:&nbsp; &nbsp; &nbsp;{infoUser?.user_major?.major_title}
                </p>
              </div>

            </div>
          </div>
          :
          <></>
      }
    </div >
  )
}

export default Home