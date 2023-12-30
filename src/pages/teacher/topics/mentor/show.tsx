import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import Loading from "@/components/loading/Loading"
import { getToken } from "@/hooks/useGetToken"
import { IGroupStudent } from "@/types/interface"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTableSelectEvent, DataTable, DataTableUnselectEvent, DataTableDataSelectableEvent } from "primereact/datatable"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import ResultMentor from "./FromScore"
import FormScore from "./FormScoreReviewer"
import showStyle from './styles/show.module.scss'
import Image from "@/components/image/Image"
import TimeAssembly from "../timeassembly/TimeAssembly"


import FormScoreReviewer from "./FormScoreReviewer";
import { InputTextarea } from "primereact/inputtextarea"
interface IDetailTopicsProps {

}

const TeacherMentorTopicsShow: React.FC<IDetailTopicsProps> = (props) => {
  const navigate = useNavigate()
  const { topicID } = useParams()
  const [openMoreInfo, setOpenMoreInfo] = useState<boolean>(false)
  const [infoUser, setInfoUser] = useState<any>(null)
  const [topicDetail, setTopicDetail] = useState<any>()
  const [groupStudents, setGroupStudents] = useState<IGroupStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedGroup, setSelectedGroup] = useState();
  const [choiced, setChoiced] = useState<string>("");
  const [idStudent, setIdStudent] = useState<string>("");
  const [openTimeAssembly, setOpenTimeAssembly] = useState<any>(false)

  const [openResultMentor, setResultMentor] = useState<any>(false)

  const [openFormScoreAssembly, setOpenFormScoreAssembly] = useState<any>(false)

  const handleCloseResultMentor = () => {
    setResultMentor(false)
  }

  const handleOpenResultMentor = (userId: any) => {
    setResultMentor(true)

    setIdStudent(userId)


  }
  const handleOpenResultAssembly = (userId: any) => {
    setOpenFormScoreAssembly(true)

    setIdStudent(userId)


  }

  const handleCloseResultAssembly = (userId: any) => {
    setOpenFormScoreAssembly(false)
  }



  const onRowSelect = (event: DataTableSelectEvent) => {
    setChoiced(event.data._id)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced("")
  };

  const handleOpenMoreInfo = (data: any) => {
    setOpenMoreInfo(true);
    setInfoUser(data);
  }
  const handleCloseMoreInfo = (data: any) => {
    setOpenMoreInfo(false);
  }

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status !== "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      topic_title: "",
      topic_description: "",
      topic_max_members: 0,
      topic_group_student: []
    },
  })

  const headers = getToken('token')

  let groupStudentId: any[] = []

  async function fetchData() {
    await axios.get(`${BASE_API_URL}/topics/teacher/findById/${topicID}`, { headers })
      .then(async (response) => {
        await setTopicDetail(response.data.data.topic)
        groupStudentId = response.data.data.topic.topic_group_student
      })
      .then(async (response) => {
        if (groupStudentId.length > 0) {
          const res = await axios.post(`${BASE_API_URL}/group-student/teacher/getManyGroupStudent`, {
            group_student_ids: groupStudentId
          }, { headers })
          if (res.data.statusCode === 200) {
            setGroupStudents(res.data.data.group_students)
            setLoading(false)
          }
        } else {
          setLoading(false)
        }
      })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleSubmitGroup = async (groupId: string) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/topics/teacher/approveGroupStudent`,
        {
          group_student_id: groupId
        }, { headers })
      if (response.data.statusCode === 200) {
        toast.success(response.data.data.message)
        try {
          console.log("Dang ky");
          const updateTopic = await axios.patch(`${BASE_API_URL}/topics/teacher/updateById/${topicID}`, {
            topic_teacher_status: "REGISTERED",
          }, { headers })
          if (updateTopic.data.data.statusCode === 200) {
            toast.success(response.data.data.message)
            window.location.reload()
          }
        } catch (error) {

        }
      }
      else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại")
      }
    } catch (error) {

    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  const handleCloseTimeAssembly = () => {
    setOpenTimeAssembly(false)
  }
  const handleOpenTimeAssembly = () => {
    setOpenTimeAssembly(true)
  }


  const memberBodyTemplate = (group: IGroupStudent) => {
    return (
      <div className="flex flex-col gap-2">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index} className="item-btw">
              <div>{member.user_name}  </div>
              <div>{member.user_id}  </div>
              <span className="pi pi-pencil hover:text-lime-500 cursor-pointer" onClick={() => handleOpenResultMentor(member?._id)} />
            </div>
          )
        })}
      </div>
    );
  };

  const memberBodyTemplateAssembly = (group: IGroupStudent) => {
    return (
      <div className="flex flex-col">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index} className="item-btw" style={{ marginTop: "10px" }}>
              <p>{member.user_name}  </p>
              <Button size="small" icon="pi pi-eye" raised onClick={() => handleOpenResultAssembly(member?._id)} />
            </div>
          )
        })}
      </div>
    );
  };
  const actionBodyTemplate = (group: any) => {
    return (
      <div>
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => navigate(`/teacher/group/students/${group._id}?topicID=${topicID}`)} />
      </div>

    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-sm text-900 font-bold">Nhóm đăng ký</span>
      <Button size="small" icon="pi pi-plus" raised label="Xác nhận" disabled={choiced == ""} visible={!Boolean(topicDetail?.topic_teacher_status == "REGISTERED")} onClick={() => handleSubmitGroup(choiced)} />
    </div>
  );
  const rowNumberTemplate = (rowData: any, { rowIndex }: any) => {
    return rowIndex + 1;
  };


  return (
    <section className="card m-[1rem] flex flex-col gap-5">

      <div className="item-btw">
        <p className='text-base font-bold'>CHI TIẾT ĐỀ TÀI</p>
        <button onClick={handleOpenTimeAssembly} style={{ padding: "5px 12px", backgroundColor: "rgb(68 112 238)", color: "#ffffff", fontSize: "15px", borderRadius: "8px" }}>
          <i className="fa-solid fa-arrow-right"></i> Hội đồng
        </button>
      </div>

      <Field>
        <Label>Tên đề tài</Label>
        {/* <Input control={control} name="topic_title" value={topicDetail?.topic_title} /> */}
        <p className={showStyle.nameTopic}>{topicDetail?.topic_title} </p>
      </Field>

      <div className="form-layout2">
        <Field>
          <Label>Số lượng thực hiện</Label>
          {/* <Input control={control} name="topic_max_members" value={topicDetail?.topic_max_members} /> */}
          <p className={showStyle.nameTopic}>{topicDetail?.topic_max_members} </p>
        </Field>
        <Field>
          <Label>Chuyên ngành</Label>
          {/* <Input control={control} name="topic_max_members" value={topicDetail?.topic_max_members} /> */}
          <p className={showStyle.nameTopic}>{topicDetail?.topic_major?.major_title} </p>
        </Field>
        <Field>
          <Label> Loại đề tài</Label>
          {/* <Input control={control} name="topic_max_members" value={topicDetail?.topic_max_members} /> */}
          <p className={showStyle.nameTopic}>{topicDetail?.topic_category?.topic_category_title} </p>
        </Field>
      </div>

      <div className="">
        <Field>
          <Label>Mô tả đề tài</Label>
          <InputTextarea
            readOnly
            className="w-full p-4 text-sm border outline-none border-none  focus:outline-none"
            value={topicDetail?.topic_description}
            rows={4}
            cols={60} />
        </Field>
      </div>

      <Label>Tài liệu quan trọng</Label>

      <div className="form-layout2">
        <Field>
          <div className={showStyle.itemFile}>
            <Label>Đơn xin bảo vệ</Label>
            <a href={`${BASE_API_URL}/${topicDetail ? topicDetail?.topic_defense_request : '#'}`} target="_blank">
              <i className="fa-regular fa-file-lines"></i>
            </a>
            {topicDetail && topicDetail?.topic_defense_request ? <p className={` ${showStyle.noteFinish}`}>
              <i className="fa-solid fa-circle-check"></i>&nbsp;Đã nộp
            </p> : <p className={showStyle.noteEmpty}>
              Chưa nộp
            </p>}
          </div>
        </Field>
        <Field>
          <div className={showStyle.itemFile}>
            <Label>Đơn xin hướng dẫn</Label>
            <a href={`${BASE_API_URL}/${topicDetail ? topicDetail?.topic_advisor_request : '#'}`} target="_blank">
              <i className="fa-regular fa-file-lines"></i>
            </a>
            {topicDetail && topicDetail?.topic_advisor_request ? <p className={` ${showStyle.noteFinish}`}>
              <i className="fa-solid fa-circle-check"></i>&nbsp;Đã nộp
            </p> : <p className={showStyle.noteEmpty}>
              Chưa nộp
            </p>}
          </div>
        </Field>
        <Field>
          <div className={showStyle.itemFile}>
            <Label>Báo cáo khoá luận</Label>
            <a href={`${BASE_API_URL}/${topicDetail ? topicDetail?.topic_final_report : '#'}`} target="_blank">
              <i className="fa-regular fa-file-lines"></i>
            </a>
            {topicDetail && topicDetail?.topic_final_report ? <p className={` ${showStyle.noteFinish}`}>
              <i className="fa-solid fa-circle-check"></i> &nbsp;Đã nộp
            </p> :
              <p className={showStyle.noteEmpty}>
                Chưa nộp
              </p>}
          </div>
        </Field>
      </div>

      <div className="flex flex-col gap-3" >
        <p className={`${showStyle.title} item-btw`}>
          <Label>Giảng viên phản biện &nbsp; &nbsp; &nbsp;
            <i className="fa-regular fa-credit-card cursor-pointer" onClick={() => handleOpenMoreInfo(topicDetail?.topic_reviewer)}></i>
          </Label>
        </p>

        <p className={showStyle.nameReviewer}>
          {topicDetail !== null ?
            <>
              {topicDetail?.topic_reviewer?.user_name}
            </> : "Chưa có thông tin"}
        </p>
      </div>


      <DataTable
        className="text-sm"
        value={groupStudents}
        removableSort header={header}
        selectionMode="single" selection={selectedGroup!}
        onSelectionChange={(e: any) => setSelectedGroup(e.value)} dataKey="_id"
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        isDataSelectable={isRowSelectable}
        tableStyle={{ minWidth: '50rem' }}
      >
        {topicDetail?.topic_teacher_status !== "REGISTERED" && <Column selectionMode="single" headerStyle={{ width: '3rem' }} />}
        <Column sortable body={rowNumberTemplate} header="STT" />
        <Column field="group_member.length" align="center" sortable header="Số lượng" />
        <Column header="Thành viên" body={memberBodyTemplate} />
        <Column header="Chi tiết tin nhóm" align="center" body={actionBodyTemplate} />
      </DataTable>

      {openResultMentor ? <ResultMentor topic={topicDetail} handleClose={handleCloseResultMentor} id={idStudent} /> : <></>}
      {openTimeAssembly ? <TimeAssembly handleClose={handleCloseTimeAssembly} openDialog={openTimeAssembly} assemblyId={topicDetail?.topic_assembly?._id} topicId={topicDetail?._id} /> : <></>}

      {
        openMoreInfo ?
          <div className={showStyle.popupMoreInfo}>
            <div className={showStyle.mainMoreInfo}>

              <div className={`${showStyle.headerInfo} item-btw`}>
                <p className={showStyle.titlePopup}>Thông tin liên hệ</p>
                <p className={showStyle.close}><i className="fa-solid fa-xmark" onClick={handleCloseMoreInfo}></i></p>
              </div>

              <div className={`${showStyle.sectionImage} item-center w-100`}>
                <div className={showStyle.image}>
                  {
                    infoUser?.user_avatar && infoUser?.user_avatar.length > 0 ?
                      <Image image={infoUser?.user_avatar} />
                      :
                      <Image image={"https://www.businessnetworks.com/sites/default/files/default_images/default-avatar.png"} />
                  }
                </div>
                <p className={showStyle.line1}>
                  <i className="fa-regular fa-user"></i>&nbsp; &nbsp; &nbsp;{infoUser?.user_name}
                </p>
              </div>

              <div className={showStyle.content1}>
                <p className={showStyle.line1}>
                  <i className="fa-regular fa-envelope text-green-500"></i>&nbsp; &nbsp; &nbsp;{infoUser?.email}
                </p>
                <p className={showStyle.line1}>
                  <i className="fa-solid fa-phone text-green-500"></i>&nbsp; &nbsp; &nbsp;{infoUser?.user_phone}
                </p>
                <p className={showStyle.line1}>
                  Khoa:&nbsp; &nbsp; &nbsp;{infoUser?.user_faculty?.faculty_title}
                </p>
                <p className={showStyle.line1}>
                  Chuyên ngành:&nbsp; &nbsp; &nbsp;{infoUser?.user_major?.major_title}
                </p>
              </div>

            </div>
          </div>
          :
          <></>
      }
    </section>
  );
};

export default TeacherMentorTopicsShow;
