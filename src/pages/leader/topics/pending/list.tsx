import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import Loading from "@/components/loading/Loading";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { DataTable, DataTableDataSelectableEvent, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Button } from "primereact/button";
import { getToken } from "@/hooks/useGetToken";
import { Dialog } from "primereact/dialog";
import moment from "moment";
import toast from "react-hot-toast";
import { Fieldset } from "primereact/fieldset";
import { Tag } from "primereact/tag";
import { ITopic } from "@/types/interface";
import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { Divider } from "primereact/divider";

interface ITopicsPendingProps {
}

const LeaderTopicsPendingList: React.FC<ITopicsPendingProps> = (props) => {
  const navigate = useNavigate()
  const [topics, setTopics] = useState([])
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState();
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [detailTopic, setDetailTopic] = useState<any>()
  const [choiced, setChoiced] = useState(0);

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

  const handleDeleteTopic = async (groupId: number) => {
    console.log("GroupID", groupId);
    try {
      const response = await axios.delete(`${BASE_API_URL}/topics/leader/deleteById/${groupId}`, { headers })
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
    console.log(groupId);
    try {
      console.log("===>>>");
      const response = await axios.patch(`${BASE_API_URL}/topics/leader/updateById/${groupId}`, {
        topic_leader_status: "ACTIVE"
      }, { headers })
      console.log('response', response);
      console.log(response.data.data.message);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setShowDetail(false)
      }
      else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error);
    }
  }

  const footerContent = (
    <div className="mt-5 flex justify-center">
      <Button size="small" label="Từ chối" icon="pi pi-trash" onClick={() => handleDeleteTopic(detailTopic?._id)} />
      <Button size="small" label="Xác nhận" icon="pi pi-send" onClick={() => handleSubmitTopic(detailTopic?._id)} autoFocus />
    </div>
  );

  const filterData = {
    filter: {
      topic_leader_status: "PENDING"
    }
  }

  const fetchData = useCallback(async () => {
    const response = await axios.post(
      `${BASE_API_URL}/topics/leader/getTopicByFilter`,
      filterData,
      { headers }
    );
    if (response.data.statusCode === 200) {
      setTopics(response.data.data.topics);
      setLoading(false);
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

  const statusBodyTemplate = (topic: any) => {
    return <Tag value={topic.topic_leader_status} severity={getLeaderSeverity(topic)} />;
  };


  const statusLeaderBodyTemplate = (topic: any) => {
    // return <Tag value={topic.topic_leader_status || "WAITING"} severity={getLeaderSeverity(topic)} />;
    return (
      <span>{topic.topic_group_student.length > 0 ? "Đã có" : "Chưa có"}</span>
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

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Đề tài chờ duyệt</span>
    </div>
  );


  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng đề tài: {topics ? topics.length : 0}</span>
    </div>

  const rowNumberTemplate = (rowData: ITopic, options: any) => {
    return <span>{options.rowIndex + 1}</span>;
  };

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
        onRowUnselect={onRowUnselect} tableStyle={{ minWidth: '50rem' }}
        emptyMessage="Không có đề tài"
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
        setSelectedProduct(undefined)
      }} footer={footerContent}>
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
            <Divider />
          <div className="form-layout">
            <Field>
              <Label>Loại đề tài</Label>
              <p>{detailTopic?.topic_category.topic_category_title}</p>
            </Field>
            <Field>
              <Label>Chuyên ngành</Label>
              <p>{detailTopic?.topic_major.major_title}</p>
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
              <p>{detailTopic?.topic_instructor.user_name}</p>
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

export default LeaderTopicsPendingList;
