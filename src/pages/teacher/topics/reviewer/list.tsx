import { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { getToken } from "@/hooks/useGetToken";

interface IMentorTopicsProps {
}

const TeacherReviewTopicsList: React.FC<IMentorTopicsProps> = (props) => {
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState()


  const user = JSON.parse(localStorage.getItem('token') || '{}')
  const userId = user._id


  const onRowSelect = (event: DataTableSelectEvent) => {
    navigate(`/teacher/topics/review/${event.data._id}`)
  };

  const headers = getToken('token')
  const filterData = {
    filter: {
      topic_teacher_status: "REGISTERED",
    }
  }

  async function fetchData() {
    const response = await axios.get(`${BASE_API_URL}/topics/teacher/getTopicsReview`, { headers })
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


  // const statusBodyTemplate = (topic: any) => {
  //   return <Tag value={topic.topic_leader_status} severity={getSeverity(topic)} />;
  // };

  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
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

  const getSeverity = (topic: any) => {
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

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xl text-900 font-bold">Đề tài phản biện</span>
      {/* <Button size="small" icon="pi pi-plus" raised label="Thêm đề tài" onClick={() => navigate('/teacher/topic/create')} /> */}
    </div>
  );

  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <section className="card m-[1rem]">
      <DataTable className="text-sm" value={topics} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="_id" onRowSelect={onRowSelect} tableStyle={{ minWidth: '50rem' }} emptyMessage="Không có đề tài">
        <Column field="topic_title" sortable header="Tên đề tài" />
        <Column field="topic_instructor.user_name" sortable header="GVHD" />
        <Column field="topic_reviewer.user_name" sortable header="GVPB" />
        <Column field="topic_major.major_title" sortable header="Chuyên ngành" />
        <Column field="topic_category.topic_category_title" sortable header="Loại đề tài" />
        <Column sortable header="Giảng viên" align="center" body={statusTeacherBodyTemplate} />
        {/* <Column header="Trưởng ngành" align="center" body={statusBodyTemplate} /> */}
      </DataTable>
    </section>
  );
};

export default TeacherReviewTopicsList;
