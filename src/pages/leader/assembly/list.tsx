import { getToken } from "@/hooks/useGetToken";
import { IAssembly } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import * as React from 'react';
import { useEffect, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Dialog } from "primereact/dialog";
import LeaderAssignAssembly from "./assign";
import LeaderCreateAssembly from "./create";
import LeaderShowAssembly from "./show";
import toast from "react-hot-toast";

interface ILeaderListAssemblyProps {
}

const LeaderListAssembly: React.FC<ILeaderListAssemblyProps> = (props) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [openDialog, setOpenDialog] = useState<boolean>(false)
  const [showDetails, setShowDetails] = useState<boolean>(false)

  const [showCreate, setShowCreate] = useState<boolean>(false)
  const [assemblyList, setAssemblyList] = useState<IAssembly[]>([])
  const [selectedAssembly, setSelectedAssembly] = useState<IAssembly>()
  const [chooseAssembly, setChooseAssembly] = useState<IAssembly>()

  const headers = getToken("token")

  const fetchAllAssembly = React.useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/assembly/findAll`, { headers });
      if (response.data.statusCode === 200) {
        setAssemblyList(response.data.data.assemblies);
        setLoading(false);
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }, [setAssemblyList, setLoading]);

  useEffect(() => {
    fetchAllAssembly()
  }, [])

  const header = (
    <div className="flex flex-wrap items-center justify-between ">
      <span className="text-base text-900 font-bold">Hội đồng đánh giá</span>
      <div className="flex items-end gap-x-2">
        <Button size="small" icon="pi pi-plus" raised label="Tạo hội đồng" onClick={() => setShowCreate(true)} />
      </div>
    </div>
  );
  const footer =
    <div className="flex flex-wrap items-center justify-center font-normal">
      <span className="text-xs">Tổng số hội đồng đánh giá: {assemblyList ? assemblyList.length : 0}</span>
    </div>

  const assemblyBodyTemplate = (assembly: IAssembly) => {
    return (
      <>
        {
          assembly.members.map((member, index) => {
            return (
              <div key={member._id}>
                {index + 1}. {member.user_name}
              </div>
            )
          })
        }
      </>
    );
  };

  const handleDelete = async (assemblyID: string) => {
    try {
      const response = await axios.delete(`${BASE_API_URL}/assembly/deleteById/${assemblyID}`, { headers })

      setAssemblyList((prevAssembly) => prevAssembly.filter((assembly) => assembly._id !== assemblyID));
      if (response.data.statusCode == 200) {
        toast.success("Xóa hội đồng thành công!");
      }
    } catch (error: any) {
      toast.error("Xóa hội đồng thất bại. Vui lòng thử lại sau.");
    }
  }

  const actionBodyTemplate = (rowData: IAssembly) => {
    return (
      <div className="flex justify-center gap-4 cursor-pointer">
        <span className="pi pi-pencil hover:text-lime-500 cursor-pointer" onClick={() => {
          setChooseAssembly(rowData)
          setOpenDialog(true)
        }} />
        <span className="pi pi-trash hover:text-red-500 cursor-pointer" onClick={() => { handleDelete(rowData._id) }} />
      </div>
    );
  };

  const customIcons = (
    <React.Fragment>
      <Button className="mr-5" onClick={() => setShowDetails(true)} label="Danh sách đề tài" icon="pi pi-eye" />
    </React.Fragment>
  );

  return (
    <section className="card m-[1rem]">
      <DataTable
        className="text-sm"
        value={assemblyList}
        removableSort
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10]}
        header={header}
        footer={footer}
        tableStyle={{ minWidth: '50rem' }}
        selection={selectedAssembly!}
        onSelectionChange={(e) => setSelectedAssembly(e.value)}
        dataKey="_id"
        sortMode="single"
        sortField="createdAt"
        sortOrder={1}
        size="small"
        emptyMessage="Không có hội đồng nào"
      >
        <Column field="assembly_name" header="Tên hội đồng" />
        <Column field="chairman.user_name" header="Chủ tịch" />
        <Column field="secretary.user_name" header="Thư ký" />
        <Column header="Thành viên" body={assemblyBodyTemplate} />
        <Column header="Hành động" align="center" body={actionBodyTemplate} />
      </DataTable>
      <Sidebar visible={showCreate} style={{ minWidth: '600px' }} onHide={() => setShowCreate(false)} position="right" className="rounded-2xl">
        <LeaderCreateAssembly />
      </Sidebar>
      <Dialog header="Phân công hội đồng" icons={customIcons} visible={openDialog} style={{ minWidth: 'fit-content' }} onHide={() => {
        setOpenDialog(false)
        setSelectedAssembly(undefined)
      }}>
        <LeaderAssignAssembly assembly={chooseAssembly} />
      </Dialog>
      <Dialog header="Danh sách đề tài" visible={showDetails} style={{ minWidth: 'fit-content' }} onHide={() => {
        setShowDetails(false)
      }}>
        <LeaderShowAssembly assembly={chooseAssembly} />
      </Dialog>
    </section>
  );
};

export default LeaderListAssembly;
