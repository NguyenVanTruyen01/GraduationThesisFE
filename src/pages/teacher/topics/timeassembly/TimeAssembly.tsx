import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/time-assembly.module.scss'
import AssemblyAPI from '@/apis/student/assembly.api'
import { Dialog } from 'primereact/dialog'
import TopicStudentAPI from '@/apis/student/topic.api'
import { Link } from 'react-router-dom'
import useStorage from '@/hooks/useStorage'
import TopicTeacherApi from '@/apis/teacher/topic.api'
import ResultMentor from './FormScoreAssembly'
import moment from 'moment'


const TimeAssembly = (props: any) => {


    let idAssembly = props?.assemblyId


    let idTopic = props?.topicId

    const [idStudent, setIdStudent] = useState<string>("");


    const [grader, setGrader] = useState<string>("");


    const [openResultMentor, setResultMentor] = useState<any>(false)

    const handleCloseResultMentor = () => {
        setResultMentor(false)
    }

    const handleOpenResultMentor = (userId: any, grader: any) => {
        setResultMentor(true)

        setIdStudent(userId)

        setGrader(grader)

    }

    let [assembly, setAssembly] = useState<any>(null)

    const [topicDetail, setTopicDetail] = useState<any>(null)

    let fetchAssemblyAPI = useCallback(async () => {
        return await AssemblyAPI.getAssembly(idAssembly)
    }, [])
    const fetchDetailTopic = useCallback(async () => {
        return await TopicTeacherApi.teacherGetOneTopic(idTopic);
    }, [])


    let userLocal: any = useStorage.GetLocalStorage("user");

    let userOptionSelectDefault: any = userLocal !== null ? JSON.parse(userLocal) : null

    console.log("Data user:" + JSON.stringify(userOptionSelectDefault));

    useEffect(() => {

        fetchAssemblyAPI().then((result: any) => {

            if (result?.statusCode === 200) {

                console.log("JSON :" + JSON.stringify(result?.data?.assembly))

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
        <>
            <Dialog
                header="Thông tin hội đồng phản biện"
                visible={props.openDialog}
                onHide={props.handleClose}
                style={{ width: '100%', height: '100vh', overflow: 'hidden', maxHeight: "unset" }}
            >
                {idAssembly ? <>
                    <div className={`${styles.body}`}>
                        <div className={styles.groupLocation}>

                            <div className={styles.locationItem}>
                                <span className={styles.icon}>
                                    <i className="fa-solid fa-book-bookmark text-yellow-500"></i>Đề tài:
                                </span>
                                <div>
                                    {topicDetail && topicDetail?.topic_title ? topicDetail?.topic_title : ""}
                                </div>
                            </div>

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

                        </div>

                        <p className={styles.titleScore}>BẢNG ĐIỂM</p>

                        <table className={styles.tableStudent}>
                            <tr className={styles.tr}>
                                <th className={`${styles.th} ${styles.titleTable}`}>Sinh viên thực hiện</th>

                                { // chỉ chỉ tịch  login mới xem được cột điieemr của chủ tích;
                                    assembly?.chairman?._id === userOptionSelectDefault?._id ? <th className={`${styles.th} ${styles.titleTable}`}>{assembly && assembly?.chairman ? assembly?.chairman?.user_name : ""}</th> : <></>
                                }


                                {// thư kí hoặc chủ tích thì xem được của thư kí
                                    assembly?.secretary?._id === userOptionSelectDefault?._id || assembly?.chairman?._id === userOptionSelectDefault?._id ?
                                        <th className={`${styles.th} ${styles.titleTable}`}>
                                            {assembly && assembly?.secretary ? assembly?.secretary?.user_name : ""}
                                        </th> : <></>
                                }


                                {
                                    assembly && assembly?.members.length > 0 ? assembly?.members.map((value: any, index: number) => {
                                        return (assembly?.chairman?._id === userOptionSelectDefault?._id || userOptionSelectDefault?._id === value?._id) ?
                                            <th className={`${styles.th} ${styles.titleTable}`}>{value?.user_name}</th> :
                                            <></>
                                    }) : <></>
                                }
                            </tr>
                            {
                                topicDetail && topicDetail?.topic_group_student[0]?.group_member?.length > 0 ?
                                    topicDetail?.topic_group_student[0]?.group_member.map((value: any, index: number) => {
                                        return <tr key={"titlename" + index} className={styles.tr}>

                                            <td className={`text-start ${styles.td}`} style={{ padding: "6px 10px", fontWeight: "bold" }}>
                                                <span className='border-none inline-block font-normal' style={{ minWidth: "300px" }}>
                                                    {value?.user_name}
                                                </span>
                                                <span className='border-none inline-block font-normal'>
                                                    {value?.user_id}
                                                </span>
                                            </td>

                                            { // chỉ chỉ tịch  login mới xem được cột điieemr của chủ tích;
                                                assembly?.chairman?._id === userOptionSelectDefault?._id ?
                                                    <td className={`${styles.td} text-center`} >
                                                        <div className={`${styles.styleScore} item-center`}>
                                                            <span className={`${styles.circle} item-center`}>
                                                                <i onClick={() => {
                                                                    setGrader(assembly?.chairman?._id)
                                                                    setResultMentor(true)
                                                                    setIdStudent(value?._id)
                                                                }} className="fa-solid fa-file-lines" style={{ cursor: "pointer" }}></i>
                                                            </span>
                                                        </div>
                                                    </td>
                                                    : <></>
                                            }
                                            {// thư kí hoặc chủ tích thì xem được của thư kí
                                                assembly?.secretary?._id === userOptionSelectDefault?._id || assembly?.chairman?._id === userOptionSelectDefault?._id ?
                                                    <td className={`${styles.td} text-center`}>
                                                        <div className={`${styles.styleScore} item-center`}>
                                                            <span className={`${styles.circle} item-center`}>
                                                                <i className="fa-solid fa-file-lines" style={{ cursor: "pointer" }} onClick={() => {
                                                                    setGrader(assembly?.secretary?._id)
                                                                    setResultMentor(true)
                                                                    setIdStudent(value?._id)
                                                                }}></i>
                                                            </span>
                                                        </div>
                                                    </td> : <></>
                                            }


                                            {
                                                assembly && assembly?.members.length > 0 ? assembly?.members.map((value3: any, index: number) => {
                                                    return (assembly?.chairman?._id === userOptionSelectDefault?._id || userOptionSelectDefault?._id === value3?._id) ?
                                                        
                                                    <td className={`${styles.td} text-center `}>
                                                                <div className={`${styles.styleScore} item-center`}>
                                                                    <span className={`${styles.circle} item-center`}>

                                                                        <span className="pi pi-pencil hover:text-lime-500 cursor-pointer" onClick={() => {
                                                                            setGrader(value3?._id)
                                                                            setResultMentor(true)
                                                                            setIdStudent(value?._id)
                                                                        }} />

                                                                        {/* <i className="fa-solid fa-file-lines" style={{ cursor: "pointer" }} onClick={() => {
                                                                            setGrader(value2?._id)
                                                                            setResultMentor(true)
                                                                            setIdStudent(value?._id)
                                                                        }} ></i> */}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            : <></> 
                                                }) : <></>
                                            }

                                            {/* {
                                                assembly && assembly?.members.length > 0 ? assembly?.members.map((value2:any,index:number)=>{
                                                    return <td  className={`${styles.td} text-center `}>
                                                        <div className={`${styles.styleScore} item-center`}>
                                                            <span className={`${styles.circle} item-center`}>
                                                                <i className="fa-solid fa-file-lines" style={{cursor:"pointer"}} onClick={()=>{
                                                                    setGrader(value2?._id)
                                                                    setResultMentor(true)
                                                                    setIdStudent(value?._id)
                                                                }} ></i>
                                                            </span>
                                                        </div>
                                                    </td>
                                                }):<></>
                                            } */}
                                        </tr>
                                    })
                                    : <></>

                            }

                        </table>

                        <p className={styles.titleScore}>HỘI ĐỒNG</p>

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

                    </div>
                </> : <div className={styles.NotFoundAssembly}>
                    <p className={styles.title}>Oops !</p>
                    <p className={styles.content}> Nhóm này chưa được phân hội đồng phản biện &nbsp; <i className="fa-solid fa-triangle-exclamation"></i></p>
                    <p className={styles.note}> Vui lòng đợi giáo vụ cập nhật thêm</p>
                    <button className={styles.close} onClick={props.handleClose}>Đóng lại</button>
                </div>}

                {openResultMentor ? <ResultMentor topic={topicDetail} handleClose={handleCloseResultMentor} id={idStudent} grader={grader} /> : <></>}

            </Dialog >

        </>
    )
}

export default TimeAssembly