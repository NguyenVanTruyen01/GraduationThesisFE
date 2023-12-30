import ButtonComponent from "@/components/button";
import Field from "@/components/field/Field";
import Input from "@/components/input/Input";
import Label from "@/components/label/Label";
import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { IUser } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import TopicTeacherApi from "@/apis/teacher/topic.api";

interface IGroupDetailsProps {
}

const LeaderGroupDetails: React.FC<IGroupDetailsProps> = (props) => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const topicID = queryParams.get('topicID');

  const [openTimeAssembly, setOpenTimeAssembly] = useState<any>(false)

  const [studentID, setStudentID] = useState<string>("")
  const [studentId, setStudentId] = useState<string>("")
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [groupDetail, setGroupDetail] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true)
  const [choiced, setChoiced] = useState(0);
  const [openSendPopup, setOpenSendPopup] = useState<boolean>(false);
  const [openResultMentor, setResultMentor] = useState<any>(false)
  const [idStudent, setIdStudent] = useState<string>("");
  const [topicDetail, setTopicDetail] = useState<any>(null)
  const [openInstructor, setOpenInstructor] = useState<boolean>(false)
  const [openReviewer, setOpenReviewer] = useState<boolean>(false)

  const handleOpenResultMentor = (userId: any) => {
    setResultMentor(true)
    setIdStudent(userId)
  }
  const handleCloseTimeAssembly = () => {
    setOpenTimeAssembly(false)
  }
  const handleOpenTimeAssembly = () => {
    setOpenTimeAssembly(true)
  }

  const { groupID } = useParams()

  const onRowSelect = (event: DataTableSelectEvent) => {
    setChoiced(event.data)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      message: "Vui lòng cập nhật bản điểm cá nhân để được xem xét thực hiện đề tài",
    },
  })

  const headers = getToken('token')

  const fetchTopicDetail = useCallback(async () => {
    return await TopicTeacherApi.teacherGetOneTopic(topicID)
  }, [])

  async function fetchData() {
    const response = await axios.get(`${BASE_API_URL}/group-student/teacher/findById/${groupID}`, { headers })
    if (response.data.statusCode === 200) {
      setGroupDetail(response.data.data.group_student.group_member)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    fetchTopicDetail().then((result: any) => {
      console.log("data topic detail : " + JSON.stringify(result?.data))
      setTopicDetail(result?.data?.topic)
    })
  }, []);

  const handleSendUpload = (studentId: string) => {
    setOpenSendPopup(true)
    setStudentID(studentId)
  }

  const handleSendNotification = async (value: any) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user_notification/sendNotifyForManyUsers`,
        {
          user_ids: [`${studentID}`],
          message: value.message
        }, { headers })
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setOpenSendPopup(false)
      }
      else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại")
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xl text-900 font-bold">Chi tiết nhóm đăng kí</span>
    </div>
  );

  const actionScoreTemplate = (student: IUser) => {
    return (
      <div onClick={handleOpenTimeAssembly} >
        <i className="pi pi-eye"></i>
      </div>
    );
  };

  const actionBodyTemplate = (student: IUser) => {
    return (
      <div>
        {
          student.hasOwnProperty("user_transcript") ? <a href={`${BASE_API_URL}/${student.user_transcript}`} target="_blank"><span className="pi pi-download" /></a> : (
            <span className="pi pi-send" onClick={() => handleSendUpload(student._id)} />
          )
        }
      </div>
    );
  };
  const actionAvarageTemplate = (student: IUser) => {
    return (
      <div>
        {
          student.hasOwnProperty("user_average_grade") ? <span>{student.user_average_grade}</span> : (
            <Button size="small" icon="pi pi-send" onClick={() => handleSendUpload(student._id)} />
          )
        }
      </div>
    );
  };

  return (
    <section className="card m-[1rem]">
      <DataTable
        className="text-sm"
        value={groupDetail}
        removableSort
        header={header}
        selectionMode="single"
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        selection=
        {selectedUser!}
        onSelectionChange={(e) => setSelectedUser(e.value)}
        dataKey="_id"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="user_name" sortable header="Họ và tên" />
        <Column field="user_id" align="center" sortable header="MSSV" />
        <Column field="user_phone" align="center" sortable header="Số điện thoại" />
        <Column field="email" sortable header="Email" />
        <Column body={actionAvarageTemplate} align="center" header="Điểm trung bình" />
        <Column header="Điểm cá nhân" align="center" body={actionBodyTemplate} />
      </DataTable>
      <Dialog header="Gửi thông báo" visible={openSendPopup} style={{ width: '50vw' }} onHide={() => setOpenSendPopup(false)}>
        <form onSubmit={handleSubmit(handleSendNotification)}>
          <div className="mt-5 -mb-3">
            <Field>
              <Label>Lời nhắn</Label>
              <Input control={control} name="message" placeholder="Vui lòng cập nhật bản điểm cá nhân để được xem xét thực hiện đề tài" />
            </Field>
          </div>
          <div className="mt-5 flex items-center justify-center">
            <ButtonComponent type="submit" className="px-5 py-3 text-white bg-bgBtn">
              Gửi thông báo
            </ButtonComponent>
          </div>
        </form>
      </Dialog>
    </section>
  );
};

export default LeaderGroupDetails;
