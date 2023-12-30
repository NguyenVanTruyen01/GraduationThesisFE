import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { getToken } from "@/hooks/useGetToken";
import { DataTable, DataTableSelectEvent } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { Column } from "primereact/column";
import { IAssembly, ITopic } from "@/types/interface";
import { Button } from "primereact/button";
import { downloadExcel } from "react-export-table-to-excel";

interface IMentorTopicsPendingProps {
}

const LeaderTopicsActiveList: React.FC<IMentorTopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedProduct, setSelectedProduct] = useState()
  const [listAssembly, setListAssembly] = useState<IAssembly[]>([])
  const [topicsDataExport, setTopicsDataExport] = useState<any>()

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
    const response = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, {
      filter: {
        topic_teacher_status: "REGISTERED",
        topic_leader_status: "ACTIVE"
      }
    }, { headers })
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics)
      setLoading(false)
      if (response.data.data.topics.length > 0) {
        let newDataCustom = [];
        for (const record of response.data.data.topics) {
          const listStudent = record.topic_group_student.flatMap((group: any) => group.group_member.map((member: any) => member.user_name)).join(', ')

          newDataCustom.push([record.topic_title, record.topic_instructor?.user_name, record.topic_reviewer?.user_name, record.topic_category?.topic_category_title, record.topic_major?.major_title, listStudent,record.topic_room, record.topic_date, record.topic_time_start, record.topic_time_end]);
        }
        setTopicsDataExport(newDataCustom);
      }
    }
  }, []);

  const fetchAssembly = useCallback(async () => {
    const response = await axios.get(`${BASE_API_URL}/assembly/findAll`, { headers })
    if (response.data.statusCode == 200) {
      setListAssembly(response.data.data.assemblies)
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchAssembly();
  }, [fetchData, fetchAssembly]);

  if (loading) {
    return (
      <Loading />
    )
  }
  const headerExport = ["Tên Đề Tài", "Giảng viên hướng dẫn", "Giảng viên phản biện", "Loại đề tài", "Chuyên ngành", "Sinh viên","Phòng bảo vệ", "Ngày bảo vệ", "Giờ bắt đầu", "Giờ kết thúc"]
  const body2 = [
    { firstname: "Edison", lastname: "Padilla", age: 14 },
    { firstname: "Cheila", lastname: "Rodrigez", age: 56 },
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "de_tai_dang_thuc_hien",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header: headerExport,
        // accept two different data structures
        body: topicsDataExport || body2,
      },
    });
  }

  const header = (
    <div className="flex flex-wrap items-center justify-between">
      <span className="text-sm text-900 font-bold">Đề tài đang thực hiện</span>
      <Button size="small" icon="pi pi-download" raised label="Tải xuống" onClick={handleDownloadExcel} />
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

export default LeaderTopicsActiveList;
