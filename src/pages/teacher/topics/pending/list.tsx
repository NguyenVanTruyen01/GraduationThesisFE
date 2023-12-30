import { useEffect, useState } from "react"
import axios from "axios"
import { BASE_API_URL } from "@/utils/globalVariables"
import Loading from "@/components/loading/Loading"
import { useNavigate } from "react-router-dom"
import { Column } from "primereact/column"
import { DataTable, DataTableDataSelectableEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable"
import { Button } from "primereact/button"
import { getToken } from "@/hooks/useGetToken"
import { Tag } from "primereact/tag"
import { Dialog } from "primereact/dialog"
import moment from "moment"
import toast from "react-hot-toast"
import { Fieldset } from "primereact/fieldset"
import TopicUpdate from "../update"
import { InputTextarea } from "primereact/inputtextarea"
interface ITopicsPendingProps {
}

const TeacherTopicsPendingList: React.FC<ITopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<any>()


  const [showEditTopic, setShowEditTopic] = useState<boolean>(false)

  const handleCloseShowEditTopic = () => {
    setShowEditTopic(false)
  }

  const [choiced, setChoiced] = useState(0);


  const headers = getToken('token')

  const onRowSelect = (event: DataTableSelectEvent) => {
    setDetailTopic(event.data)
    setShowDetail(true)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const handleSetDetailTopicUpdate = (data: any) => {
    setDetailTopic(data)
  }


  const handleDeleteTopic = async (groupId: number) => {
    console.log("GroupID", groupId);
    try {
      const response = await axios.delete(`${BASE_API_URL}/topics/teacher/deleteById/${groupId}`, { headers })
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitTopic = async (groupId: number) => {
    try {
      const response = await axios.patch(`${BASE_API_URL}/topics/teacher/updateById/${groupId}`, {
        topic_leader_status: "PENDING"
      }, { headers })
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error) {
      console.log(error);
    }
  }

  const footerContent = (
    <div className="mt-5 flex justify-center">
      <Button size="small" className="bg-red-500 border-none" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} />
      <Button size="small" className="bg-green-500 border-none" disabled={detailTopic?.topic_leader_status === "PENDING" || detailTopic?.topic_leader_status === "ACTIVE" ? true : false} label="Gửi đăng ký" icon="pi pi-send" onClick={() => handleSubmitTopic(detailTopic?._id)} autoFocus />
      <Button size="small" className="border-none" disabled={detailTopic?.topic_leader_status === "PENDING" || detailTopic?.topic_leader_status === "ACTIVE" ? true : false} label="Cập nhật đề tài" icon="pi pi-send" onClick={
        () => {
          setShowEditTopic(true)
        }
      } autoFocus />
    </div>
  );

  const filterData = {
    filter: {
      topic_teacher_status: "READY",
      // topic_leader_status: "READY"
    }
  }
  const filterData2 = {
    filter: {
      topic_teacher_status: "REGISTERED",
      topic_leader_status: "PENDING"
    }
  }

  async function fetchData() {
    const response = await axios.post(`${BASE_API_URL}/topics/teacher/getTopicByFilter`, filterData, { headers })
    const response2 = await axios.post(`${BASE_API_URL}/topics/teacher/getTopicByFilter`, filterData2, { headers })
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics.concat(response2.data.data.topics))
      setLoading(false)

    }

  }
  useEffect(() => {
    fetchData()
    // fetchData2()
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }


  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
  };

  const statusLeaderBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_leader_status || "WAITING"} severity={getLeaderSeverity(topic)} />;
  };

  const countGroupStudent = (topic: any) => {
    const arrayLength = topic?.topic_group_student[0]?.group_member ? topic.topic_group_student[0].group_member.length : 0;
    return <p>{arrayLength}</p>
  }

  const getLeaderSeverity = (topic: any) => {
    switch (topic.topic_leader_status) {
      case 'PENDING':
        return 'warning';
      case 'CANCELED':
        return 'danger';
      case 'ACTIVE':
        return 'success';
      default:
        return null;
    }
  };

  const getTeacherSeverity = (topic: any) => {
    switch (topic.topic_teacher_status) {
      case 'READY':
        return 'warning';
      case 'CANCELED':
        return 'danger';
      case 'REGISTERED':
        return 'success';
      case 'COMPLETE':
        return 'success';
      default:
        return null;
    }
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-xl text-900 font-bold">Đề tài lên trưởng khoa</span>
      <Button size="small" icon="pi pi-plus" raised label="Thêm đề tài" onClick={() => navigate('/teacher/topic/create')} />
      {/* <Button size="small" icon="pi pi-plus" raised label="Download Excel" onClick={handleDownloadExcel} /> */}
    </div>
  );

  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <section className="card m-[1rem]">

      <DataTable
        className="text-sm"
        value={topics}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header} footer={footer}
        selectionMode="single"
        selection={selectedProduct!}
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        dataKey="_id"
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect} tableStyle={{ minWidth: '50rem' }}
        emptyMessage="Chưa có đề tài">
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" sortable header="GVHD" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" sortable header="Loại đề tài" />
        <Column header="Sinh viên thực hiện" align="center" body={countGroupStudent} />
        <Column header="Giảng viên" align="center" body={statusTeacherBodyTemplate} />
        <Column header="Giáo vụ" align="center" body={statusLeaderBodyTemplate} />
      </DataTable>

      <Dialog header="Chi tiết đề tài" visible={showDetail} style={{ width: '90vw' }} onHide={() => {
        setShowDetail(false)
        setSelectedProduct(undefined)
        setShowEditTopic(false)
      }} footer={footerContent}>

        {
          showEditTopic ?
            <div className="flex flex-col justify-center mt-5 font-bold text-base gap-5">
              <TopicUpdate handleClose={handleCloseShowEditTopic} topic={detailTopic} handleSetDetailTopicUpdate={handleSetDetailTopicUpdate} />
            </div>
            :
            <div className="flex flex-col justify-center mt-5 font-bold text-sm gap-3">
              <Fieldset className="border border-borderColor text-sm font-medium" legend="Tên đề tài">
                {detailTopic?.topic_title}
              </Fieldset>
              <div className="flex flex-row mt-5 text-sm gap-3 w-full justify-between">
                <Fieldset className="border border-borderColor text-sm w-6/12" legend="Chuyên ngành">
                  {detailTopic?.topic_major?.major_title}
                </Fieldset>
                <Fieldset className="border border-borderColor text-sm w-6/12" legend="Loại đề tài">
                  {detailTopic?.topic_category?.topic_category_title}
                </Fieldset>
              </div>

              <Fieldset className="border border-borderColor text-sm" legend="Mô tả đề tài">
                <InputTextarea readOnly className="border border-borderColor text-sm w-full" value={detailTopic?.topic_description} rows={5} cols={40} />
              </Fieldset>
              <Fieldset className="border border-borderColor text-sm" legend="Sinh viên thực hiện">
                <DataTable
                  className="text-sm"
                  value={detailTopic?.topic_group_student[0]?.group_member}
                  removableSort
                  rows={5}
                  selectionMode="single"
                  dataKey="_id"
                  emptyMessage="Chưa có sinh viên"
                >
                  <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="user_name" sortable header="Tên sinh viên" />
                  <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="user_id" sortable header="Mã số sinh viên" />
                  <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis " field="user_average_grade" sortable header="Điểm tổng kết" />
                </DataTable>
              </Fieldset>
              <Fieldset className="border border-borderColor text-sm" legend="Người tạo">
                {detailTopic?.topic_creator?.user_name}
              </Fieldset>
              <Fieldset className="border border-borderColor text-sm" legend="Thời gian tạo">
                {moment(detailTopic?.createdAt).format("DD-MM-YYYY")}
              </Fieldset>
            </div>
        }
      </Dialog>
    </section>
  );
};

export default TeacherTopicsPendingList;
