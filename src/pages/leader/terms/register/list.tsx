import Loading from "@/components/loading/Loading"
import { getToken } from "@/hooks/useGetToken"
import { IRegisterPeriod, ITerm } from "@/types/interface"
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
import RegisterCreate from "./create"
import LeaderRegisterShow from "./show"

type Props = {}

const RegisterList = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [visible, setVisible] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const [selectedPeriod, setSelectedPeriod] = useState<IRegisterPeriod>()
  const [data, setData] = useState<IRegisterPeriod[]>([])
  const headers = getToken('token')

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/registration_period/leader/getAll`, { headers });
      if (response.status === 200) {
        setData(response.data.data.registration_period);
        setLoading(false);
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error("Đã có lỗi xảy ra, vui lòng kiểm tra lại");
      } else {
        console.error(error);
      }
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

  const handleDelete = async (periodID: string) => {
    try {
      // Thực hiện xóa giáo viên từ server
      const response = await axios.delete(`${BASE_API_URL}/registration_period/leader/deleteById/${periodID}`, { headers })
      setData((prevData) => prevData.filter((period) => period._id !== periodID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa thành công!");
      }

    } catch (error: any) {
      toast.error("Xóa thất bại. Vui lòng thử lại sau.");
    }
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

  const header = (
    <div className="flex flex-wrap items-center justify-between">
      <span className="text-base text-900 font-bold">Đợt đăng ký</span>
      <div>
        <Button size="small" className="mr-2" icon="pi pi-plus" raised label="Tạo đợt đăng ký"
          onClick={() => setVisible(true)}
        />
      </div>
    </div>
  );

  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng đợt đăng ký: {data ? data.length : 0} </span>
    </div>

  const actionBodyTemplate = (rowData: IRegisterPeriod) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        <span className="pi pi-eye hover:text-lime-500 cursor-pointer" onClick={() => {
          setShowDetails(true)
          setSelectedPeriod(rowData)
        }} />
        <span className="pi pi-trash hover:text-amber-700 cursor-pointer" onClick={() => {
          handleDelete(rowData._id)
        }} />
      </div>
    );
  };

  return (
    <Fragment>
      <section className="card m-[1rem]">
        <DataTable className="text-sm" value={data} removableSort paginator paginatorClassName="regularFont" rows={5} rowsPerPageOptions={[5, 10]} header={header} footer={footer} tableStyle={{ minWidth: '50rem' }}>
          <Column field="registration_period_semester.semester" align="center" sortable header="Học kì" />
          <Column align="center" header="Năm học" body={yearBodyTemplate} />
          <Column align="center" header="Thời gian bắt đầu" body={startBodyTemplate} />
          <Column align="center" header="Thời gian kết thúc" body={endBodyTemplate} />
          <Column header="Trạng thái" align="center" body={statusBodyTemplate} />
          <Column align="center" body={actionBodyTemplate} />
        </DataTable>
      </section>
      <Sidebar visible={visible} onHide={() => setVisible(false)} position="right" className="w-[fit-content]">
        <RegisterCreate />
      </Sidebar>

      <Sidebar header="Chi tiết" visible={showDetails} onHide={() => setShowDetails(false)} position="right" className="w-[fit-content]">
        <LeaderRegisterShow period={selectedPeriod} />
      </Sidebar>
    </Fragment>
  )
}

export default RegisterList