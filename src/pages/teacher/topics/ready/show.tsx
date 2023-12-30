import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import Loading from "@/components/loading/Loading"
import { getToken } from "@/hooks/useGetToken"
import { ITopic, IGroupStudent } from "@/types/interface"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTableSelectEvent, DataTable, DataTableUnselectEvent, DataTableDataSelectableEvent } from "primereact/datatable"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Link, useLocation, useNavigate, useParams } from "react-router-dom"
import showStyle from './styles/show.module.scss'
import Image from "@/components/image/Image";
import TimeAssembly from "../timeassembly/TimeAssembly";
import { InputTextarea } from "primereact/inputtextarea"
interface IDetailTopicsProps {

}

const TeacherReadyTopicsShow = (props: any) => {
  const navigate = useNavigate()

  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);

  // const topicID = queryParams.get('topicID');

  const { topicID } = useParams()
  const [topicDetail, setTopicDetail] = useState<any>()
  const [groupStudents, setGroupStudents] = useState<IGroupStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true)
  const [selectedGroup, setSelectedGroup] = useState();
  const [choiced, setChoiced] = useState<string>("");


  const onRowSelect = (event: DataTableSelectEvent) => {
    setChoiced(event.data._id)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced("")
  };

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



  const memberBodyTemplate = (group: IGroupStudent) => {
    return (
      <div className="flex flex-col gap-4">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index} className="item-btw flex">
              <div>{member.user_name}</div>
              <div>{member.user_id}</div>
            </div>
          )
        })
        }
      </div >
    );
  };
  const memberBodyTemplateAssembly = (group: IGroupStudent) => {
    return (
      <div className="flex flex-col">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index} className="item-btw" style={{ marginTop: "10px" }}>
              <p>{member.user_name}  </p>
              <Button size="small" icon="pi pi-pencil" raised
              // onClick={()=>handleOpenResultAssembly(member?._id)} 
              />
            </div>
          )
        })}
      </div>
    );
  };
  const actionBodyTemplate = (group: any) => {
    return (
      <div>
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => navigate(`/teacher/group/detail-waitaccept/${group._id}`)} />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-sm text-900 font-bold">Nhóm đăng ký</span>
      <Button className="text-sm text-900 font-bold" size="small" icon="pi pi-plus" raised label="Duyệt nhóm thực hiện" disabled={choiced == ""} visible={!Boolean(topicDetail?.topic_teacher_status == "REGISTERED")} onClick={() => handleSubmitGroup(choiced)} />
    </div>
  );
  const rowNumberTemplate = (rowData: any, { rowIndex }: any) => {
    return rowIndex + 1;
  };

  return (
    <section className="card m-[1rem] flex flex-col gap-5">
      <div className="item-btw">
        <p className='text-base font-bold'>CHI TIẾT ĐỀ TÀI</p>
      </div>

      <Field>
        <Label>Tên đề tài</Label>
        <p className={showStyle.nameTopic}>{topicDetail?.topic_title} </p>
      </Field>

      <div className="form-layout2">
        <Field>
          <Label>Tối đa sinh viên thực hiện</Label>
          <p className={showStyle.nameTopic}>{topicDetail?.topic_max_members} </p>
        </Field>
        <Field>
          <Label>Chuyên ngành</Label>
          <p className={showStyle.nameTopic}>{topicDetail?.topic_major?.major_title} </p>
        </Field>
        <Field>
          <Label> Loại đề tài</Label>
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
        <Column sortable body={rowNumberTemplate} header="Nhóm" />
        <Column field="group_member.length" align="center" sortable header="Số lượng" />
        <Column header="Thành viên" body={memberBodyTemplate} />
        <Column header="Chi tiết thông tin nhóm" align="center" body={actionBodyTemplate} />
      </DataTable>

    </section>
  );
};

export default TeacherReadyTopicsShow;
