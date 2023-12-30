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
import { downloadExcel } from "react-export-table-to-excel";

interface IMentorTopicsProps {
}

const TeacherMentorTopicsList: React.FC<IMentorTopicsProps> = (props) => {
  const navigate = useNavigate()

  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [topicsDataExport, setTopicsDataExport] = useState<any>()

  const onRowSelect = (event: DataTableSelectEvent) => {
    navigate(`/teacher/topics/mentor/${event.data._id}`)
  };

  const headerExport = ["Tên Đề Tài", "Loại đề tài", "Giảng Viên hướng dẫn ", "Người tạo", "Sinh viên thực hiện", "Trưởng ngành Status"];
  const body = [
    ["Edison", "Padilla", 14],
    ["Cheila", "Rodrigez", 56],
  ];
  const body2 = [
    { firstname: "Edison", lastname: "Padilla", age: 14 },
    { firstname: "Cheila", lastname: "Rodrigez", age: 56 },
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "Danh sách đề tài hướng dẫn",
      sheet: "Danh sách đề tài hướng dẫn",
      tablePayload: {
        header: headerExport,
        // accept two different data structures
        body: topicsDataExport || body2,
      },
    });
  }
  const headers = getToken('token')
  const filterData = {
    filter: {
      topic_teacher_status: "REGISTERED",
      topic_leader_status: "ACTIVE"
    }
  }

  async function fetchData() {
    const response = await axios.post(`${BASE_API_URL}/topics/teacher/getTopicByFilter`, filterData, { headers })
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics)
      setLoading(false)
      if (response.data.data.topics.length > 0) {
        let newDataCustom = []
        for (const record of response.data.data.topics) {
          let listStudentInfo = record?.topic_group_student[0]?.group_member
          let dataInfoStudent = ""
          if (listStudentInfo !== null && listStudentInfo.length > 0) {
            for (let index = 0; index < listStudentInfo.length; index++) {
              dataInfoStudent += listStudentInfo[index]?.user_name + " - " + listStudentInfo[index]?.user_id + '\n'
            }
          }
          newDataCustom.push([record?.topic_title, record?.topic_category?.topic_category_title, record?.topic_instructor.user_name, record?.topic_creator?.user_name, dataInfoStudent, record?.topic_leader_status])
        }
        setTopicsDataExport(newDataCustom)
      }

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

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <span className="text-xl text-900 font-bold">Đề tài của tôi</span>
      {/* <Button size="small" icon="pi pi-plus" raised label="Thêm đề tài" onClick={() => navigate('/teacher/topic/create')} /> */}
      {/* <Button size="small" icon="pi pi-plus" raised label="Download Excel" onClick={handleDownloadExcel} /> */}
    </div>
  );

  const footer = `Tổng cộng ${topics ? topics.length : 0} đề tài.`;

  return (
    <section className="card m-[1rem]">
      <DataTable className="text-sm"
        value={topics}
        removableSort
        paginator rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        selectionMode="single"
        selection={selectedProduct!}
        onSelectionChange={(e) => setSelectedProduct(e.value)}
        dataKey="_id" onRowSelect={onRowSelect}
        tableStyle={{ minWidth: '50rem' }}
        emptyMessage="Không có đề tài"
      >
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" sortable header="GVHD" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_reviewer.user_name" sortable header="GVPB" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" sortable header="Loại đề tài" />
        <Column header="SVTH" align="center" body={countGroupStudent} />
        <Column header="Giảng viên" align="center" body={statusTeacherBodyTemplate} />
        <Column header="Trạng thái" align="center" body={statusBodyTemplate} />
      </DataTable>
    </section>
  );
};

export default TeacherMentorTopicsList;
