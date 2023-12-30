import api from "@/apis/axios/api";
import Field from "@/components/field/Field";
import Input from "@/components/input/Input";
import Label from "@/components/label/Label";
import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { IGroupStudent, IReviewer, ITopic } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTableSelectEvent, DataTable, DataTableUnselectEvent, DataTableDataSelectableEvent, DataTableFilterMeta } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useCallback, useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from "primereact/inputnumber";
import LeaderFormScore from "../../group/formscore";
import LeaderTimeAssembly from "../../assembly_review/timeassembly";

interface IDetailTopicsProps {
}

const LeaderActiveTopicsShow: React.FC<IDetailTopicsProps> = (props) => {
  const navigate = useNavigate()
  const { topicID } = useParams()

  const [visible, setVisible] = useState<boolean>(false);
  const [openInstructor, setOpenInstructor] = useState<boolean>(false)
  const [openReviewer, setOpenReviewer] = useState<boolean>(false)
  const [openAssembly, setOpenAssembly] = useState<boolean>(false)

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    user_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    user_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [listTeachers, setListTeachers] = useState<IReviewer[]>([]);
  const [studentId, setStudentId] = useState<string>("")
  const [selectedReviewer, setSelectedReviewer] = useState<IReviewer>();
  const [selectedTeacher, setSelectedTeacher] = useState<IReviewer>();

  const [topicDetail, setTopicDetail] = useState<ITopic>()
  const [groupStudents, setGroupStudents] = useState<IGroupStudent[]>([]);
  const [topicReviewer, setTopicReviewer] = useState<IReviewer>()
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState();
  const [openSendPopup, setOpenSendPopup] = useState<boolean>(false);

  const onRowSelect = (event: DataTableSelectEvent) => {
    setSelectedTeacher(event.data)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setSelectedTeacher(undefined)
  };

  const handleCloseInstructor = () => {
    setOpenInstructor(false)
  }

  const handleCloseReviewer = () => {
    setOpenReviewer(false)
  }

  const handleCloseTimeAssembly = () => {
    setOpenAssembly(false)
  }

  const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      // message: "",
      topic_reviewer: ""
    },
  })

  const headers = getToken('token')

  let groupStudentId: any[] = []

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/topics/leader/findById/${topicID}`, { headers });

      const topicData = response.data.data.topic;
      setTopicDetail(topicData);

      const groupStudentId = topicData.topic_group_student;
      if (groupStudentId && groupStudentId.length > 0) {
        const res = await axios.post(
          `${BASE_API_URL}/group-student/teacher/getManyGroupStudent`,
          { group_student_ids: groupStudentId },
          { headers }
        );

        if (res.data.statusCode === 200) {
          setGroupStudents(res.data.data.group_students);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      // Handle errors here
    }
  }, [topicID]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);


  const footerDialog = (
    <div className="flex items-center justify-center mt-4">
      <Button size="small" label="Xóa lựa chọn" icon="pi pi-trash" onClick={() => setSelectedReviewer(undefined)} />
      <Button size="small" className="ml-5" label="Xác nhận" icon="pi pi-check" onClick={() => {
        onSubmit()
      }} autoFocus />
    </div>
  );

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      user_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      user_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    setGlobalFilterValue('');
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let _filters = { ...filters };

    // @ts-ignore
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const clearFilter = () => {
    initFilters();
  };

  useEffect(() => {
    async function fetchTeacher() {
      const response = await axios.post(`${BASE_API_URL}/users/leader/getTeacherToReviewTopics`, {}, { headers })

      if (response.data.statusCode === 200) {

        const filteredTeachers = response.data.data.users.filter(
          (teacher: any) => teacher._id !== topicDetail?.topic_instructor._id
        );
        setListTeachers(filteredTeachers);

        const selectedTeacher = filteredTeachers.find(
          (teacher: any) => teacher._id === topicDetail?.topic_reviewer._id
        );
        if (selectedTeacher) {
          setSelectedReviewer(selectedTeacher);
        }
      }
    }
    if (visible) {
      fetchTeacher()
    }
  }, [visible])

  useEffect(() => {
    setTopicReviewer(topicDetail?.topic_reviewer)
  }, [topicDetail])

  const handleSendNotification = async (value: any) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user_notification/sendNotiForStudentOfTopics`,
        {
          topic_ids: [`${topicID}`],
          message: value.message
        }, { headers })
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setOpenSendPopup(false)
      }
      else {
        toast.error("Có lỗi xảy ra, vui lòng thử lại")
      }
    } catch (error) {

    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  const onSubmit = async () => {
    const result = await api.patch(`/topics/leader/updateById/${topicDetail?._id}`, { topic_reviewer: selectedTeacher?._id }, headers)
    const topicData = {
      topic_group_student: result.topic.topic_group_student,
      topic_instructor: result.topic.topic_instructor,
    };

    const user_ids = [];

    if (topicData.topic_group_student && Array.isArray(topicData.topic_group_student)) {
      user_ids.push(...topicData.topic_group_student);
    }

    if (topicData.topic_instructor) {
      user_ids.push(topicData.topic_instructor);
    }

    console.log("user_ids", user_ids);

    const sendReviewer = await api.post(`/user_notification/sendNotifyForManyUsers`, {
      "user_ids": [result.topic.topic_reviewer],
      "title": "Thông báo phân công phản biện",
      "message": `Bạn đã được trưởng ngành phân công phản biện đề tài ${result.topic.topic_title}`
    }, headers)

    const sendGroup = await api.post(`/user_notification/sendNotifyForManyUsers`, {
      "user_ids": user_ids,
      "title": "Thông báo phân công phản biện",
      "message": `Đề tài ${result.topic.topic_title} đã được phân công giảng viên phản biện`
    }, headers)

    const response = await axios.patch(`${BASE_API_URL}/topics/leader/updateById/${topicDetail?._id}`, { topic_reviewer: selectedTeacher?._id }, { headers })
    if (response.data.statusCode === 200) {
      toast.success("Gán giảng viên phản biện thành công")
      setTopicReviewer(selectedTeacher)
      return;
    }
    toast.error("Có lỗi xảy ra, vui lòng thử lại")
  }

  const memberBodyTemplate = (group: any) => {
    return (
      <div className="flex flex-col gap-x-5">
        {group?.group_member.map((member: any, index: number) => {
          return (
            <div key={index} className="flex justify-between">
              <span>{index + 1}. {member.user_name}</span>
              <div>
                <span className="mr-4 hover:text-emerald-400 cursor-pointer" onClick={() => {
                  setOpenInstructor(true)
                  setStudentId(member._id)
                }}> <i className="pi pi-eye"></i> Hướng dẫn
                </span>
                <span className="mr-4 hover:text-emerald-400 cursor-pointer" onClick={() => {
                  setOpenReviewer(true)
                  setStudentId(member._id)
                }}> <i className="pi pi-eye"></i> Phản biện
                </span>
                <span className="mr-4 hover:text-emerald-400 cursor-pointer" onClick={() => {
                  setOpenAssembly(true)
                  setStudentId(member._id)
                }}> <i className="pi pi-eye"></i> Hội đồng
                </span>
              </div>
            </div>
          )
        })}
      </div>
    );
  };
  const actionBodyTemplate = (group: any) => {
    return (
      <div className="flex items-center justify-center">
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => navigate(`/leader/group/students/${group._id}`)} />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-between">
        <Button size="small" type="button" icon="pi pi-filter-slash" label="Xóa tìm kiếm" outlined onClick={clearFilter} />
        <span className="flex justify-between">
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
        </span>
      </div>
    );
  };

  const headerDialog = renderHeader()

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base font-medium mr-4">Nhóm thực hiện</span>
      <Button type="button" size="small" icon="pi pi-bell" raised title="Gửi thông báo" onClick={() => setOpenSendPopup(!openSendPopup)} />
    </div >
  );

  return (
    <section className="card m-[1rem] ">
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4">
        <div className="flex items-center mb-6">
          <i className="fa-solid fa-pencil" />
          <span className="ml-3 text-xl font-bold">Chi tiết đề tài</span>
        </div>
        <Field>
          <Label>Tên đề tài</Label>
          <InputText className=" w-full text-sm" readOnly value={topicDetail?.topic_title} />
        </Field>
        <Field>
          <Label>Mô tả đề tài</Label>
          <InputTextarea readOnly className="w-full text-sm" value={topicDetail?.topic_description} />
        </Field>

        <div className="form-layout ">
          <Field>
            <Label>Giảng viên hướng dẫn</Label>
            <InputText className=" w-full text-sm" readOnly value={topicDetail?.topic_instructor?.user_name} />
          </Field>
          <Field>
            <Label htmlFor="topic_reviewer">Giảng viên phản biện</Label>
            <InputText className="w-full text-sm" onClick={() => setVisible(true)} readOnly value={topicReviewer?.user_name} />
            <Dialog
              header="Chọn giảng viên phản biện"
              visible={visible}
              onHide={() => {
                setVisible(false)
              }}
              footer={footerDialog}
            >
              <DataTable
                className="text-sm"
                value={listTeachers}
                removableSort
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10]}
                tableStyle={{ width: 'fit-content' }}
                loading={loading}
                onRowSelect={onRowSelect}
                onRowUnselect={onRowUnselect}
                dataKey="user_id"
                selectionMode='single'
                selection={selectedReviewer!}
                onSelectionChange={(e) => setSelectedReviewer(e.value)}
                filters={filters} globalFilterFields={['user_name', 'user_id']}
                header={headerDialog}
                emptyMessage="Không tìm thấy kết quả">
                <Column selectionMode="single" />
                <Column field="email" header="Email" />
                <Column field="user_name" sortable header="Họ tên" />
                <Column field="user_id" sortable header="Mã số" />
                <Column field="user_major.major_title" header="Chuyên ngành" />
                <Column field="totalReviewTopics" align="center" sortable header="Số lượng phản biện" />
              </DataTable>
            </Dialog>
          </Field>
        </div>
        <div className="form-layout2">
          <Field>
            <Label>Chuyên ngành</Label>
            <InputText className=" w-full text-sm" readOnly value={topicDetail?.topic_major.major_title} disabled />
          </Field>
          <Field>
            <Label>Loại đề tài</Label>
            <InputText className=" w-full text-sm" readOnly value={topicDetail?.topic_category.topic_category_title} disabled />
          </Field>
          <Field>
            <Label>Số lượng thực hiện</Label>
            <InputNumber className=" w-full text-sm" readOnly value={topicDetail?.topic_group_student.length} disabled />
          </Field>
        </div>
        <div className="flex justify-around items-center">
          <Field>
            <Label>Đơn xin hướng dẫn: </Label>
            {
              topicDetail?.topic_advisor_request ?
                <a className="border-none text-sm border-borderColor rounded-lg p-1 text-green-500 font-bold"
                  href={`${BASE_API_URL}/${topicDetail?.topic_advisor_request}`} target="_blank">
                  <span className="pi pi-download" /> Tải xuống ngay
                </a> : (
                  <span className="text-red-500 font-bold text-sm"><span className="pi pi-times" /> Chưa có file</span>
                )
            }
          </Field>
          <Field>
            <Label>Đơn xin bảo vệ: </Label>
            {
              topicDetail?.topic_defense_request ?
                <a className="border-none text-sm border-borderColor rounded-lg p-1 text-green-500 font-bold"
                  href={`${BASE_API_URL}/${topicDetail?.topic_defense_request}`} target="_blank">
                  <span className="pi pi-download" /> Tải xuống ngay
                </a> : (
                  <span className="text-red-500 font-bold text-sm"><span className="pi pi-times" /> Chưa có file</span>
                )
            }
          </Field>
          <Field>
            <Label>Báo cáo tổng kết: </Label>
            {
              topicDetail?.topic_final_report ?
                <a className="border-none text-sm border-borderColor rounded-lg p-1 text-green-500 font-bold"
                  href={`${BASE_API_URL}/${topicDetail?.topic_final_report}`} target="_blank">
                  <span className="pi pi-download" /> Tải xuống ngay
                </a> : (
                  <span className="text-red-500 font-bold text-sm"><span className="pi pi-times" /> Chưa có file</span>
                )
            }
          </Field>
        </div>

        <DataTable
          className="text-sm mt-2"
          value={groupStudents}
          header={header}
          selection={selectedGroup!}
          onSelectionChange={(e: any) => setSelectedGroup(e.value)}
          dataKey="_id"
          onRowSelect={onRowSelect}
          onRowUnselect={onRowUnselect}
          isDataSelectable={isRowSelectable}
          tableStyle={{ minWidth: '50rem' }}
        >
          <Column field="group_member.length" align="center" header="Số lượng" />
          <Column header="Thành viên" body={memberBodyTemplate} />
          <Column align="center" body={actionBodyTemplate} />
        </DataTable>
      </form>

      <Dialog header="Gửi thông báo" visible={openSendPopup} style={{ minWidth: '500px' }} onHide={() => setOpenSendPopup(false)}>
        <form onSubmit={handleSubmit(handleSendNotification)}>
          <div className="">
            <Field>
              <Label>Đề tài</Label>
              <Input control={control} name="topic_title" value={topicDetail?.topic_title} />
            </Field>
            <Field>
              <Label>Lời nhắn</Label>
              <Input control={control} name="message" />
            </Field>
          </div>
          <div className="flex items-center justify-center">
            <Button size="small" type="submit" label="Gửi thông báo" icon="pi pi-send" />
          </div>
        </form>
      </Dialog>

      {openInstructor && <LeaderFormScore topicDetail={topicDetail} handleClose={handleCloseInstructor} studentId={studentId} rubricCategory={1}/>}
      {openReviewer && <LeaderFormScore topicDetail={topicDetail} handleClose={handleCloseReviewer} studentId={studentId} rubricCategory={2}/>}

      {openAssembly && <LeaderTimeAssembly handleClose={handleCloseTimeAssembly} openDialog={openAssembly} assemblyId={topicDetail?.topic_assembly?._id} topicId={topicDetail?._id} />}
    </section>
  );
};

export default LeaderActiveTopicsShow;
