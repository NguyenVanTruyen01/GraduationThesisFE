import {  useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { Link, useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { Tag } from "primereact/tag"
import { getToken } from "@/hooks/useGetToken";
import TimeAssembly from "../timeassembly/TimeAssembly";

interface IMentorTopicsProps {
}

const TeacherReviewTopicsAssemblyList: React.FunctionComponent<IMentorTopicsProps> = (props) => {
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState()

  const [openTimeAssembly, setOpenTimeAssembly] = useState<any>(false)

  const [topicId, setTopicId] = useState(null)
  const [assemblyId, setAssemblyId] = useState(null)

  const user = JSON.parse(localStorage.getItem('token') || '{}')
  const userId = user._id


  const handleCloseTimeAssembly = () => {
    setOpenTimeAssembly(false)
    setSelectedProduct(undefined)
  }

  const handleOpenTimeAssembly = () => {
    setOpenTimeAssembly(true)
  }

  const handleSetAssembly = (e:any) => {

    setTopicId(e.targer.value)
    setAssemblyId(e.targer.value)
  }


  const onRowSelect = (event: DataTableSelectEvent) => {
    setTopicId(event.data._id)
    setAssemblyId(event.data?.topic_assembly?._id)
    handleOpenTimeAssembly()
  };

  const headers = getToken('token')
  const filterData = {
    filter: {
      topic_teacher_status: "REGISTERED",
      // topic_leader_status: "ACTIVE"
    }
  }

  async function fetchData() {
    const response = await axios.get(`${BASE_API_URL}/topics/teacher/getTopicsAssembly`, { headers })
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics)
      setLoading(false)
    }
    else{

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


  const statusBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_leader_status} severity={getSeverity(topic)} />;
  };

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


  const downLoadFile = (topic: any) => {
   return <Link target="_blank" to={`/${topic?.topic_final_report}`}>
    {topic?.topic_final_report !== null && topic?.topic_final_report?.length > 0 ? <i className="fa-solid fa-download"></i> : "Chưa nộp" }
    </Link>
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xl text-900 font-bold">Hội đồng tham gia</span>
    </div>
  );

  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <section className="card m-[1rem]">
      <DataTable className="text-sm" value={topics} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} selectionMode="single" selection={selectedProduct!} onSelectionChange={(e) => setSelectedProduct(e.value)} dataKey="_id" onRowSelect={onRowSelect} tableStyle={{ minWidth: '50rem' }} emptyMessage="Không có hội đồng">
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài " />
        <Column field="role_assembly" header="Chức vụ " />
        <Column field="topic_date" sortable header="Ngày tham dự" />
        <Column body={downLoadFile} align="center" header="Báo cáo cuối kì" />
        <Column sortable header="Thời gian" align="center" field="topic_time_start" />
        <Column header="Địa điểm" align="center" field="topic_room" />
      </DataTable>
      {openTimeAssembly ? <TimeAssembly handleClose={handleCloseTimeAssembly} openDialog={openTimeAssembly}  assemblyId={assemblyId} topicId ={topicId} /> : <></>}
    </section>
  );
};

export default TeacherReviewTopicsAssemblyList;
