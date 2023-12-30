import { Fragment, useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/hooks/useGetToken";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Column } from "primereact/column";

interface IMentorTopicsPendingProps {
}

const LeaderTopicsAnalysisList: React.FC<IMentorTopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState();

  const onRowSelect = (event: DataTableSelectEvent) => {
    navigate(`/leader/topics/active/${event.data._id}`)
  };

  const headers = getToken('token')

  const statusBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_leader_status} severity={getSeverity(topic)} />;
  };

  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
  };

  const countGroupStudent = (topic: any) => {
    const arrayLength = topic?.topic_group_student[0]?.group_member ? topic.topic_group_student[0].group_member.length : 0;
    return <p>{arrayLength}</p>
  }


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

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/topics/leader/getTopicByFilter`,
        {
          filter: {
            topic_teacher_status: "REGISTERED",
            topic_leader_status: "ACTIVE",
            topic_category: "65582fff60cbc25a341017a3",
          },
        },
        { headers }
      );
      console.log(response);
      if (response.data.statusCode === 200) {
        setTopics(response.data.data.topics);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Loading />
    )
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between">
      <span className="text-base text-900 font-bold">Đề tài nghiên cứu</span>
    </div>
  );

  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng đề tài: {topics ? topics.length : 0}</span>
    </div>

  const rowNumberTemplate = (rowData: any, options: any) => {
    return <span>{options.rowIndex + 1}</span>;
  };

  return (
    <section className="card m-[1rem]">
      <DataTable
        className="text-sm"
        value={topics}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        selectionMode="single"
        selection={selectedProduct!}
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        dataKey="_id"
        onRowSelect={onRowSelect}
        tableStyle={{ minWidth: '50rem' }}
        emptyMessage="Không có đề tài"
      >
        <Column body={rowNumberTemplate} align="center" header="STT" />
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" header="Hướng dẫn" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_reviewer.user_name" header="Phản biện" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" align="center" header="Loại đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_registration_period.registration_period_semester.semester" sortable header="Học kì" align="center" />
        <Column field="topic_max_members" align="center" sortable header="Tối đa" />
        <Column header="Số lượng" align="center" body={countGroupStudent} />
        <Column header="Giáo vụ" align="center" body={statusBodyTemplate} />
      </DataTable>
    </section>
  );
};

export default LeaderTopicsAnalysisList;
