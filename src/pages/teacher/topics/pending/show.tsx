import Field from "@/components/field/Field";
import Input from "@/components/input/Input";
import Label from "@/components/label/Label";
import Loading from "@/components/loading/Loading";
import DashboardHeading from "@/components/modules/dashboard/heading/heading";
import { getToken } from "@/hooks/useGetToken";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableDataSelectableEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { InputTextarea } from "primereact/inputtextarea";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface IDetailPendingTopicsProps {
}

const TeacherPendingTopicsShow: React.FC<IDetailPendingTopicsProps> = (props) => {
  const navigate = useNavigate()
  const { topicID } = useParams()

  const [topicDetail, setTopicDetail] = useState<any>({})
  const [groupStudents, setGroupStudents] = useState([]);
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState();
  const [choiced, setChoiced] = useState(0);

  const onRowSelect = (event: DataTableSelectEvent) => {
    setChoiced(event.data._id)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
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

  const handleSubmitTopics = async (topicID: any) => {
    const response = await axios.patch(`${BASE_API_URL}/topics/teacher/updateById/${topicID}`, {
      topic_leader_status: "PENDING"
    }, { headers })
    if (response.data.statusCode === 200) {
      toast.success(response.data.message)
      navigate("//leader/topics/mentor")
    }
    else {
      toast.error(response.data.message)
    }
  }

  const handleSubmitGroup = async (groupId: number) => {
    console.log(groupId);
    try {
      const response = await axios.post(`${BASE_API_URL}/topics/teacher/approveGroupStudent`,
        {
          group_student_id: groupId
        }, { headers })
      if (response.data.statusCode === 200) {
        toast.success(response.data.data.message)
        try {
          const updateTopic = await axios.post(`${BASE_API_URL}/topics/teacher/updateById/${topicID}`, {
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

  const memberBodyTemplate = (group: any) => {
    return (
      <div className="flex flex-col">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index}>{index + 1}. {member.user_name}</div>
          )
        })}
      </div>
    );
  };
  const actionBodyTemplate = (group: any) => {
    return (
      <div>
        <Button size="small" icon="pi pi-eye" raised onClick={() => navigate(`/teacher/groups-details/${group._id}`)} />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Chọn nhóm đăng ký</span>
      <Button size="small" icon="pi pi-plus" raised label="Xác nhận" disabled={choiced === 0} onClick={() => handleSubmitGroup(choiced)} />
    </div>
  );

  const footer = `Tổng cộng ${groupStudents ? groupStudents.length : 0} đề tài.`;
  const rowNumberTemplate = (rowData:any, { rowIndex }:any) => {
    return rowIndex + 1;
  };
  return (
    <Fragment>
      <div className="w-full rounded-lg shadow-lg h-[85vh]">
        <DashboardHeading icon="fa-solid fa-pencil" title="Chi tiết đề tài" />
        <div className="mx-3 -mt-4 form-layout">
          <Field>
            <Label>Tên đề tài</Label>
            <Input control={control} name="topic_title" value={topicDetail.topic_title} />
          </Field>
          <Field>
            <Label>Số lượng thực hiện</Label>
            <Input control={control} name="topic_max_members" value={topicDetail.topic_max_members} />
          </Field>
        </div>

        <div className="mx-3 -mt-4">
          <Field>
            <Label>Mô tả đề tài</Label>
            <InputTextarea className="w-full p-2 text-sm font-semibold border outline-none border-strock rounded-xl placeholder:text-text4 focus:outline-none focus:border-primary" value={topicDetail.topic_description} rows={4} cols={30} />
          </Field>
        </div>
        <DataTable className="rounded-xl -mt-4" value={groupStudents} showGridlines removableSort paginator rows={5} rowsPerPageOptions={[5, 10 ]} header={header} selectionMode="single" selection={selectedGroup!} onSelectionChange={(e: any) => setSelectedGroup(e.value)} dataKey="_id" onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} isDataSelectable={isRowSelectable} tableStyle={{ minWidth: '50rem' }}>
          <Column selectionMode="single" headerStyle={{ width: '3rem' }} />
          {/* <Column field="_id" sortable header="ID nhóm" /> */}
          <Column  sortable body={rowNumberTemplate} header="STT"   />
          <Column field="group_member.length" sortable header="Số lượng" />
          <Column header="Thành viên" body={memberBodyTemplate} />
          <Column header="Hành động" body={actionBodyTemplate} />
        </DataTable>
        <div className=" flex items-center justify-center">
          <Button size="small" icon="pi pi-plus" label="Gửi yêu cầu" onClick={() => handleSubmitTopics(topicID)} />
        </div>
      </div>
    </Fragment>
  );
};

export default TeacherPendingTopicsShow;
