import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable, DataTableDataSelectableEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Button } from "primereact/button";
import { getToken } from "@/hooks/useGetToken";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import toast from "react-hot-toast";
import { Fieldset } from "primereact/fieldset";
import { ITopic } from "@/types/interface";

interface ITopicsPendingProps {
}

const TeacherTopicsReadyList: React.FC<ITopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<any>()
  const [selectedGroup, setSelectedGroup] = useState();
  const [choiced, setChoiced] = useState(0);

  const headers = getToken('token')
  const onRowSelect = (event: DataTableSelectEvent) => {
    // setDetailTopic(event.data)
    // setShowDetail(true)
    navigate(`/teacher/group/students-waitaccept/${event.data?._id}`);
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const handleDeleteTopic = async (groupId: number) => {
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
        topic_leader_status: "ACTIVE",
        topic_teacher_status: "READY"
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
      <Button size="small" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} />
      <Button size="small" disabled={detailTopic?.topic_leader_status === "ACTIVE" ? true : false} label="Gửi" icon="pi pi-send" onClick={() => handleSubmitTopic(detailTopic?._id)} autoFocus />
    </div>
  );

  const filterData = {
    filter: {
      topic_leader_status: "ACTIVE",
      topic_teacher_status: "READY"
    }
  }

  async function fetchData() {
    const response = await axios.post(`${BASE_API_URL}/topics/teacher/getTopicByFilter`, filterData, { headers })
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, []);

  if (loading) {
    return (
      <Loading />
    )
  }

  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
  };

  const statusLeaderBodyTemplate = (topic: ITopic) => {
    return <Tag value={topic.topic_leader_status || "WAITING"} severity={getLeaderSeverity(topic)} />;
  };

  const countGroupStudent = (topic: ITopic) => {
    const arrayLength = topic?.topic_group_student ? topic.topic_group_student.length : 0;
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
      <span className="text-xl text-900 font-bold">Đề tài chờ duyệt</span>
      {/* <Button size="small" icon="pi pi-plus" raised label="Thêm đề tài" onClick={() => navigate('/teacher/topic/create')} /> */}
    </div>
  );

  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <section className="card m-[1rem]">

      <DataTable className="text-sm" value={topics} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="_id" onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} tableStyle={{ minWidth: '50rem' }} emptyMessage="Chưa có đề tài">
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" sortable header="GVHD" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" header="Loại đề tài" />
        <Column header="Số nhóm đăng kí" align="center" body={countGroupStudent} />
        <Column header="Giảng viên" align="center" body={statusTeacherBodyTemplate} />
        <Column header="Trạng thái" align="center" body={statusLeaderBodyTemplate} />
      </DataTable>
      {/*
      <Dialog header="Chi tiết đề tài" visible={showDetail} style={{ width: '50vw' }} onHide={() => {
        setShowDetail(false)
        setSelectedProduct(undefined)
      }} footer={footerContent}>
        <div className="flex flex-col justify-center mt-5 font-bold text-base gap-5">
          <Fieldset className="border border-borderColor" legend="Tên đề tài">
            {detailTopic?.topic_title}
          </Fieldset>
          <Fieldset className="border border-borderColor" legend="Mô tả đề tài">
            {detailTopic?.topic_description}
          </Fieldset>
          <Fieldset className="border border-borderColor" legend="Người tạo">
            {detailTopic?.topic_creator?.user_name}
          </Fieldset>
          <Fieldset className="border border-borderColor" legend="Thời gian">
            {moment(detailTopic?.createdAt).format("DD-MM-YYYY")}
          </Fieldset>
        </div>
      </Dialog> */}
    </section>
  );
};

export default TeacherTopicsReadyList;
