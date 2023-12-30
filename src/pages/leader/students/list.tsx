import Loading from "@/components/loading/Loading"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { useCallback, useEffect, useState } from 'react'
import toast from "react-hot-toast"
import { DataTable, DataTableSelectEvent, DataTableUnselectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button"
import { getToken } from "@/hooks/useGetToken"
import { useNavigate } from "react-router-dom"
import { IUser } from "@/types/interface"
import moment from "moment"

type Props = {}

const StudentList = (props: Props) => {
  const navigate = useNavigate()
  const [students, setStudents] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true)

  const headers = getToken('token')
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/leader/search`, { role: "STUDENT" }, { headers });
      setStudents(response.data.data.users);
      setLoading(false);
    } catch (error: any) {
      toast.error(error);
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

  const handleDelete = async (studentID: string) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/users/leader/deleteById/${studentID}`, { headers })
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== studentID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa sinh viên thành công!");
      } else {
        toast.success("Xóa sinh viên thành công!");
      }
    } catch (error: any) {
      toast.error("Xóa sinh viên thất bại. Vui lòng thử lại sau.");
    }
  }

  const birthDay = (student: IUser) => {
    return (
      <span>{moment(student.user_date_of_birth).format("DD-MM-YYYY")}</span>
    )
  };

  const actionBodyTemplate = (student: IUser) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => {
          navigate(`/leader/students/${student._id}`)
        }} />
        <span className="pi pi-trash hover:text-amber-700 cursor-pointer" onClick={() => handleDelete(student._id)} />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Sinh viên</span>
      <Button size="small" icon="pi pi-plus" raised label="Thêm sinh viên" onClick={() => navigate('/leader/user/create')} />
    </div>
  );
  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng sinh viên: {students ? students.length : 0}</span>
    </div>

  return (
    <section className="card m-[1rem]">
      <DataTable
        className="text-sm"
        value={students}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column field="user_name" align="left" sortable header="Họ và tên" />
        <Column field="user_id" align="center" sortable header="MSSV" />
        <Column field="email" align="center" sortable header="Email" />
        <Column align="center" sortable header="Ngày sinh" body={birthDay}/>
        <Column field="user_average_grade" align="center" header="Điểm TB" />
        <Column field="user_phone" align="center" header="SĐT" />
        <Column align="center" body={actionBodyTemplate} />
      </DataTable>
    </section>
  )
}

export default StudentList