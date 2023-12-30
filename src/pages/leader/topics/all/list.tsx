import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { Column } from "primereact/column";
import { DataTable, DataTableDataSelectableEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Button } from "primereact/button";
import { getToken } from "@/hooks/useGetToken";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import toast from "react-hot-toast";
import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { ITopic } from "@/types/interface";
import { downloadExcel } from "react-export-table-to-excel";
import { Divider } from "primereact/divider";

interface ITopicsPendingProps {
}

const LeaderTopicList: React.FC<ITopicsPendingProps> = (props) => {
  const [topics, setTopics] = useState<ITopic[]>([])
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<ITopic>();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<ITopic>()
  const [choiced, setChoiced] = useState(0)
  const [topicsDataExport, setTopicsDataExport] = useState<any>()

  const headers = getToken('token')

  const onRowSelect = (event: DataTableSelectEvent) => {
    setDetailTopic(event.data)
    setShowDetail(true)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const handleDeleteTopic = async (groupId: any) => {
    console.log("GroupID", groupId);
    try {
      const response = await axios.delete(`${BASE_API_URL}/topics/leader/deleteById/${groupId}`, { headers })
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== groupId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSubmitTopic = async (groupId: any) => {
    console.log(groupId);
    try {
      const response = await axios.patch(`${BASE_API_URL}/topics/leader/updateById/${groupId}`, {
        topic_leader_status: "ACTIVE"
      }, { headers })
      console.log('response', response);
      console.log(response.data.data.message);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)

      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const footerDialog = (
    <div className="mt-5 flex justify-center">
      {/* <Button size="small" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} /> */}
      <Button disabled={detailTopic?.topic_leader_status == "ACTIVE"} size="small" label="Xác nhận" icon="pi pi-send" onClick={() => handleSubmitTopic(detailTopic?._id)} autoFocus />
    </div>
  );

  const filterData = {
    filter: {
      topic_teacher_status: "READY",
      topic_leader_status: "PENDING"
    }
  }


  const headerExport = ["Tên Đề Tài", "Giảng viên hướng dẫn", "Giảng viên phản biện", "Loại đề tài", "Chuyên ngành", "Sinh viên", "Phòng bảo vệ", "Ngày bảo vệ", "Giờ bắt đầu", "Giờ kết thúc"]
  const body2 = [
    { firstname: "Edison", lastname: "Padilla", age: 14 },
    { firstname: "Cheila", lastname: "Rodrigez", age: 56 },
  ];

  function handleDownloadExcel() {
    downloadExcel({
      fileName: "toan_bo_de_tai",
      sheet: "react-export-table-to-excel",
      tablePayload: {
        header: headerExport,
        // accept two different data structures
        body: topicsDataExport || body2,
      },
    });
  }

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/topics/leader/getAll`, { headers });
      if (response.data.statusCode === 200) {
        setTopics(response.data.data.topics);
        setLoading(false);
        if (response.data.data.topics.length > 0) {
          let newDataCustom = [];
          for (const record of response.data.data.topics) {
            const listStudent = record.topic_group_student.flatMap((group: any) => group.group_member.map((member: any) => member.user_name)).join(', ')

            newDataCustom.push([record.topic_title, record.topic_instructor?.user_name, record.topic_reviewer?.user_name, record.topic_category?.topic_category_title, record.topic_major?.major_title, listStudent, record.topic_room, record.topic_date, record.topic_time_start, record.topic_time_end]);
          }
          setTopicsDataExport(newDataCustom);
        }
      }
    } catch (error) {
      console.log(error);
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

  const createdTime = (topic: ITopic) => {
    return (
      <span>{moment(topic.createdAt).format("DD-MM-YYYY")}</span>
    )
  };

  const countNumberStudent = (topic: ITopic) => {
    return (
      <span>{topic.topic_group_student.length}</span>
    )
  };

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

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Toàn bộ đề tài</span>
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
        selection={selectedTopic!}
        onSelectionChange={(e) => setSelectedTopic(e.value)}
        dataKey="_id"
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column body={rowNumberTemplate} align="center" header="STT" />
        <Column style={{ maxWidth: 200 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_title" sortable header="Tên đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_instructor.user_name" header="GVHD" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_category.topic_category_title" align="center" header="Loại đề tài" />
        <Column style={{ maxWidth: 150 }} className="whitespace-nowrap overflow-hidden overflow-ellipsis" field="topic_registration_period.registration_period_semester.semester" sortable header="Học kì" align="center" />
        <Column field="topic_max_members" align="center" sortable header="Tối đa" />
        <Column header="Thời gian tạo" align="center" body={createdTime} />
        <Column header="Số lượng" align="center" body={countNumberStudent} />
        <Column header="Giáo vụ" align="center" body={statusLeaderBodyTemplate} />
      </DataTable>
      <Dialog header="Chi tiết đề tài" visible={showDetail} style={{ width: '50vw' }} onHide={() => {
        setShowDetail(false)
        setSelectedTopic(undefined)
      }}
        footer={footerDialog}
      >
        <div className="flex flex-col justify-center mt-5 text-base gap-5">
          <Field>
            <Label>Tên đề tài</Label>
            <p>{detailTopic?.topic_title}</p>
          </Field>
          <Divider />
          <Field>
            <Label>Mô tả đề tài</Label>
            <p>{detailTopic?.topic_description}</p>
          </Field>
          <div className="form-layout">
            <Field>
              <Label>Loại đề tài</Label>
              <p>{detailTopic?.topic_category?.topic_category_title}</p>
            </Field>
            <Field>
              <Label>Chuyên ngành</Label>
              <p>{detailTopic?.topic_major?.major_title}</p>
            </Field>
          </div>
          <Divider />
          <div className="form-layout">
            <Field>
              <Label>Người tạo</Label>
              <p>{detailTopic?.topic_creator?.user_name}</p>
            </Field>
            <Field>
              <Label>Giảng viên hướng dẫn</Label>
              <p>{detailTopic?.topic_instructor?.user_name}</p>
            </Field>
          </div>
          <Divider />
          <div className="form-layout">
            <Field>
              <Label>Giảng viên phản biện</Label>
              <p>{detailTopic?.topic_reviewer?.user_name || "Chưa phân công"}</p>
            </Field>
            <Field>
              <Label>Sinh viên thực hiện</Label>
              <p>{detailTopic?.topic_group_student.length}</p>
            </Field>
          </div>
        </div>
      </Dialog>
    </section>
  );
};

export default LeaderTopicList;
