import { useCallback, useEffect, useState } from "react";
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
import toast from "react-hot-toast";
import { downloadExcel } from "react-export-table-to-excel";
import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { ITopic } from "@/types/interface";

interface ITopicsPendingProps {
}

const HistoryTopicLeader: React.FC<ITopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState<ITopic[]>([])
  const [topicsDataExport, setTopicsDataExport] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTopic, setSelectedTopic] = useState<ITopic>();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<ITopic>()
  const [choiced, setChoiced] = useState(0);
  const [registrationPeriod, setRegistrationPeriod] = useState<any>()

  const headers = getToken('token')

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

  const onRowSelect = (event: DataTableSelectEvent) => {
    setDetailTopic(event.data)
    setShowDetail(true)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const handleDeleteTopic = async (topicId: any) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/topics/teacher/deleteById/${topicId}`, { headers })
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setTopics((prevTopics) => prevTopics.filter((topic) => topic._id !== topicId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const footerContent = (
    <div className="mt-5 flex justify-center">
      <Button size="small" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} />
    </div>
  );

  const fetchData = useCallback(async (filterData: any) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, filterData, { headers });
      const period = await axios.get(`${BASE_API_URL}/registration_period/leader/getAll`, { headers });

      if (response.data.statusCode === 200) {
        setTopics(response.data.data.topics);
        setLoading(false);

        if (response.data.data.topics.length > 0) {
          let newDataCustom = [];
          for (const record of response.data.data.topics) {
            const listStudent = record.topic_group_student.flatMap((group: any) => group.group_member.map((member: any) => member.user_name)).join(', ')

            newDataCustom.push([record.topic_title, record.topic_instructor?.user_name, record.topic_reviewer?.user_name, record.topic_category?.topic_category_title, record.topic_major?.major_title, listStudent,record.topic_room, record.topic_date, record.topic_time_start, record.topic_time_end]);
          }
          setTopicsDataExport(newDataCustom);
        }
      }

      if (period.data.statusCode === 200) {
        setRegistrationPeriod(period.data.data.registration_period);
      }
    } catch (error) {
      console.log(error);
    }
  }, [setTopics, setLoading, setTopicsDataExport, setRegistrationPeriod]);

  useEffect(() => {
    fetchData({ filter: {} });
  }, [fetchData]);

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

  const countGroupStudent = (topic: ITopic) => {
    const arrayLength = topic.topic_group_student[0]?.group_member?.length;
    return <p>{arrayLength}</p>
  }

  const handleFilterSemeterChange = (e: any) => {
    const filter: any = {

    }
    if (e.target.value.length !== 0) {
      filter.topic_registration_period = e.target.value
    }
    fetchData({ filter })
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
      <span className="text-base text-900 font-bold">Đề tài qua các năm</span>
      <Button size="small" icon="pi pi-download" raised label="Tải xuống" onClick={handleDownloadExcel} />
    </div>
  );

  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng đề tài: {topics ? topics.length : 0}</span>
    </div>

  return (
    <section className="card m-[1rem]">
      <Field>
        <Label htmlFor="topic_registration_period">Chọn học kỳ</Label>
        <select onChange={(e) => handleFilterSemeterChange(e)}>
          <option value={''}>All</option>
          {
            registrationPeriod && registrationPeriod?.length > 0 ? registrationPeriod.map((value: any, index: number) => {
              return <option value={value._id} key={'period' + index}>{value.registration_period_semester.school_year_start + "/" + value.registration_period_semester.school_year_end + ' - ' + value.registration_period_semester.semester}</option>
            }) : <></>
          }
        </select>
      </Field>
      <DataTable
        className="text-sm"
        value={topics}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header} footer={footer}
        selectionMode="single"
        selection={selectedTopic!}
        onSelectionChange={(e) => setSelectedTopic(e.value)}
        dataKey="_id"
        onRowSelect={onRowSelect}
        onRowUnselect={onRowUnselect} tableStyle={{ minWidth: '50rem' }}
        emptyMessage="Không có đề tài"
        >
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

      <Dialog header="Chi tiết đề tài" visible={showDetail} style={{ width: '50vw' }} onHide={() => {
        setShowDetail(false)
        setSelectedTopic(undefined)
      }} footer={footerContent}>
        <div className="flex flex-col justify-center mt-5 text-base gap-5">
          <div className="form-layout">
            <Field>
              <Label>Tên đề tài</Label>
              <p>{detailTopic?.topic_title}</p>
            </Field>
            <Field>
              <Label>Mô tả đề tài</Label>
              <p>{detailTopic?.topic_description}</p>
            </Field>
          </div>
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

export default HistoryTopicLeader;
