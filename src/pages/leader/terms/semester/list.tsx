import Loading from "@/components/loading/Loading"
import { getToken } from "@/hooks/useGetToken"
import { ISemester, ITerm } from "@/types/interface"
import { convertNumberToDate } from "@/utils/ConvertDate"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Sidebar } from "primereact/sidebar"
import { Tag } from "primereact/tag"
import { Fragment, useCallback, useEffect, useState } from 'react'
import toast from "react-hot-toast"
import SemesterCreate from "./create"
import LeaderSemesterShow from "./show"
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup"

type Props = {}


const SemesterList = (props: Props) => {
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState<boolean>(false);
  const [data, setData] = useState<ISemester[]>([])
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [selectedSemester, setSelectedSemester] = useState<ISemester>()

  const headers = getToken('token')

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/semester/leader/getAll`, { headers });
      if (response.status === 200) {
        setData(response.data.data.semesters);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error('Đã có lỗi xảy ra, vui lòng kiểm tra lại');
      } else {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    // Call fetchData when component mounts
    fetchData();
  }, [fetchData]);


  const handleDelete = async (semesterID: string) => {
    try {
      // Thực hiện xóa giáo viên từ server
      const response = await axios.delete(`${BASE_API_URL}/semester/leader/deleteById/${semesterID}`, { headers })
      setData((prevData) => prevData.filter((semester) => semester._id !== semesterID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa thành công!");
      }

    } catch (error: any) {
      toast.error("Xóa thất bại. Vui lòng thử lại sau.");
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

  const getSeverity = (registration_period_status: boolean) => {
    switch (registration_period_status) {
      case true:
        return 'success';
      case false:
        return 'danger';
      default:
        return null;
    }
  };

  const statusBodyTemplate = (registerTerm: ITerm) => {
    return <Tag value={registerTerm.registration_period_status === true ? "Đang hoạt động" : "Không hoạt động"} severity={getSeverity(registerTerm.registration_period_status)} />;
  };

  const startBodyTemplate = (registerTerm: ITerm) => {
    return (
      <span>{convertNumberToDate(registerTerm.registration_period_start)}</span>
    );
  };

  const endBodyTemplate = (registerTerm: ITerm) => {
    return (
      <span>{convertNumberToDate(registerTerm.registration_period_end)}</span>
    );
  };

  const yearBodyTemplate = (registerTerm: ITerm) => {
    return (
      <span>{`${registerTerm.registration_period_semester.school_year_start} - ${registerTerm.registration_period_semester.school_year_end}`}</span>
    );
  };

  const actionBodyTemplate = (rowData: ISemester) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => {
          setShowDetails(true)
          setSelectedSemester(rowData)
        }} />
        <span className="pi pi-trash hover:text-amber-700 cursor-pointer" onClick={() => handleDelete(rowData._id)} />
      </div>
    );
  };


  const header = (
    <div className="flex flex-wrap items-center justify-between">
      <span className="text-xl text-900 font-bold">Học kỳ</span>
      <div>
        <Button size="small" className="mr-2" icon="pi pi-plus" raised label="Tạo học kỳ" onClick={() => setVisible(true)} />
      </div>
    </div>
  );
  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng cộng {data ? data.length : 0} học kỳ</span>
    </div>

  return (
    <Fragment>
      <ConfirmPopup />
      <section className="card m-[1rem]">
        <DataTable className="text-sm" value={data} removableSort paginator paginatorClassName="regularFont" rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} tableStyle={{ minWidth: '50rem'}}>
          <Column field="semester" align="left" header="Năm học"/>
          <Column field="school_year_start" align="center" header="Thời gian bắt đầu"/>
          <Column field="school_year_end" align="center" header="Thời gian kết thúc"/>
          <Column align="center" body={actionBodyTemplate} />
        </DataTable>
      </section>
      <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="w-[fit-content]">
        <SemesterCreate />
      </Sidebar>

      <Sidebar header="Chi tiết" visible={showDetails} onHide={() => setShowDetails(false)} position="right" className="w-[fit-content]">
        <LeaderSemesterShow semester={selectedSemester}/>
      </Sidebar>
    </Fragment>
  )
}

export default SemesterList