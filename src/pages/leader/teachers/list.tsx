import Loading from "@/components/loading/Loading"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { Fragment, useCallback, useEffect, useState } from 'react'
import toast from "react-hot-toast"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button"
import { getToken } from "@/hooks/useGetToken"
import { useNavigate } from "react-router-dom"
import { IUser } from "@/types/interface"
import moment from "moment"

type Props = {}

const TeacherList = (props: Props) => {
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true)

  const headers = getToken('token')
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/leader/search`, { role: "TEACHER" }, { headers });
      setTeachers(response.data.data.users);
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

  const handleDelete = async (teacherID: string) => {
    try {
      // Thực hiện xóa giáo viên từ server
      const response = await axios.delete(`${BASE_API_URL}/users/leader/deleteById/${teacherID}`, { headers })

      // Nếu xóa thành công, cập nhật danh sách giáo viên bằng cách loại bỏ giáo viên có _id là teacherID
      setTeachers((prevTeachers) => prevTeachers.filter((teacher) => teacher._id !== teacherID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa giáo viên thành công!");
      }

    } catch (error: any) {
      toast.error("Xóa giáo viên thất bại. Vui lòng thử lại sau.");
    }
  }

  const actionBodyTemplate = (teacher: IUser) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => { navigate(`/leader/teachers/${teacher._id}`) }} />
        <span className="pi pi-trash hover:text-amber-700 cursor-pointer" onClick={() => handleDelete(teacher._id)} />
      </div>
    );
  };

  const header = (
    <div className="flex flex-wrap items-center justify-between">
      <span className="text-base text-900 font-bold">Giảng viên</span>
      <Button size="small" icon="pi pi-plus" raised label="Thêm giảng viên" onClick={() => navigate('/leader/user/create')} />
    </div>
  );

  const birthDay = (student: IUser) => {
    return (
      <span>{moment(student.user_date_of_birth).format("DD-MM-YYYY")}</span>
    )
  };

  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng số giảng viên: {teachers ? teachers.length : 0}</span>
    </div>

  return (
    <section className="card m-[1rem]">
      <DataTable className="text-sm" value={teachers} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} tableStyle={{ minWidth: '50rem' }}>
        <Column field="user_name" align="left" sortable header="Họ và tên" />
        <Column field="user_id" align="center" sortable header="Mã số" />
        <Column field="email" align="center" sortable header="Email" />
        <Column align="center" sortable header="Ngày sinh" body={birthDay}/>
        <Column field="user_phone" align="center" header="Điện thoại" />
        <Column header="Hành động" align="center" body={actionBodyTemplate} />
      </DataTable>
    </section>
  )
}

export default TeacherList