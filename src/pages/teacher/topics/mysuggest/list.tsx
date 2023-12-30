import { useEffect, useState } from "react";
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
import { downloadExcel } from "react-export-table-to-excel";

interface ITopicsProposedProps {
}

const TeacherTopicsMySuggestList: React.FC<ITopicsProposedProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [topicsDataExport, setTopicsDataExport] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<any>()
  const [choiced, setChoiced] = useState(0);

  const headers = getToken('token')

  const headerExport = ["Tên Đề Tài", "Tên giảng viên", "Số lượng","Loại đề tài","Sinh viên thực hiện", "Status"];
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
      fileName: "react-export-table-to-excel -> downloadExcel method",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header: headerExport,
        // accept two different data structures
        body: topicsDataExport || body2,
      },
    });
  }

  const onRowSelect = (event: DataTableSelectEvent) => {
    setDetailTopic(event.data)
    setShowDetail(true)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

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
      <Button size="small" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} />
      <Button size="small" disabled={detailTopic?.topic_leader_status === "PENDING" ? true : false} label="Gửi" icon="pi pi-send" onClick={() => handleSubmitTopic(detailTopic?._id)} autoFocus />
    </div>
  );

  const filterData = {
    filter: {
      topic_teacher_status: "PENDING"
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

          console.log("Record:"+record)

          newDataCustom.push(["Đề tài lập trình web", "HUỲNH XUÂN PHỤNG", "3", "Pending"])
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

  const statusTeacherBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_teacher_status} severity={getTeacherSeverity(topic)} />;
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
      case 'PENDING':
        return 'warning';
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
      <span className="text-xl text-900 font-bold">Đề tài của tôi</span>
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
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" sortable header="Loại đề tài" />
        <Column header="Số lượng nhóm đăng kí" align="center" body={countGroupStudent} />
      </DataTable>

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
      </Dialog>
    </section>
  );
};

export default TeacherTopicsMySuggestList;
