import Loading from "@/components/loading/Loading"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { Fragment, useEffect, useState } from 'react'
import toast from "react-hot-toast"
// import DataTable from 'react-data-table-component'
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button"
import { Tag } from "primereact/tag"
import { getToken } from "@/hooks/useGetToken"
import { ITopic } from "@/types/interface"

type Props = {}

const TeacherAllTopicsList = (props: Props) => {

  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true)

  const headers = getToken('token')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${BASE_API_URL}/topics/teacher/getAll`, { headers })
        setTopics(response.data.data.topics)
        setLoading(false)
      } catch (error: any) {
        toast.error(error)
      }

    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <Loading />
    )
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

  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
  };

  const statusLeaderBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_leader_status || "WAITING"} severity={getLeaderSeverity(topic)} />;
  };

  const countGroupStudent = (topic: ITopic) => {
    const arrayLength = topic.topic_group_student[0]?.group_member?.length;
    return <p>{arrayLength}</p>
  }

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
      <span className="text-base text-900 font-bold">Toàn bộ đề tài</span>
      <Button size="small" icon="pi pi-refresh" raised onClick={() => window.location.reload()} />
    </div>
  );
  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <div className="card m-[1rem]">
      <DataTable className="text-sm" value={topics} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} tableStyle={{ minWidth: '50rem' }}>
      <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" sortable header="GVHD" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" sortable header="Loại đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" filterField="topic_registration_period.registration_period_semester.semester" field="topic_registration_period.registration_period_semester.semester" sortable header="Học kì" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" filterField="topic_registration_period.registration_period_semester.semester" field="topic_registration_period.registration_period_semester.school_year_start" sortable header="Năm bắt đầu" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" filterField="topic_registration_period.registration_period_semester.semester" field="topic_registration_period.registration_period_semester.school_year_end" sortable header="Năm kết thúc" />
        <Column header="SVTH" align="center" body={countGroupStudent} />
        <Column header="Giảng viên" align="center" body={statusTeacherBodyTemplate} />
        <Column header="Trạng thái" align="center" body={statusLeaderBodyTemplate} />
      </DataTable>
    </div>
  )
}

export default TeacherAllTopicsList