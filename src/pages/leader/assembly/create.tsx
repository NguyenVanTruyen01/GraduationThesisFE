import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { IChairman, IDropdown, IMajor, IMember, IRegisterPeriod, IReviewer, ISecretary } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableDataSelectableEvent, DataTableFilterMeta, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { Divider } from "primereact/divider";
import { Dropdown } from "primereact/dropdown";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import * as React from 'react';
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ILeaderCreateAssemblyProps {
}

const LeaderCreateAssembly: React.FC<ILeaderCreateAssemblyProps> = (props) => {
  const [showChairman, setShowChairman] = useState<boolean>(false)
  const [showSecretary, setShowSecretary] = useState<boolean>(false)
  const [showMember, setShowMember] = useState<boolean>(false)
  const [numMem, setNumMem] = useState<number>(1)

  const [currentPeriod, setCurrentPeriod] = useState<IRegisterPeriod>()
  const [majorList, setMajorList] = useState<IMajor[]>([])
  const [majorID, setMajorID] = useState<IDropdown>()

  const [listChairman, setListChairman] = useState<IReviewer[]>([])
  const [chairman, setChairman] = useState<IChairman>()
  const [selectedChairman, setSelectedChairman] = useState<IReviewer>()

  const [listSecretary, setListSeacretary] = useState<IReviewer[]>([])
  const [secretary, setSecretary] = useState<ISecretary>()
  const [selectedSecretary, setSelectedSecretary] = useState<IReviewer>()

  const [listMember, setListMember] = useState<IReviewer[]>([]);
  const [selectedMembers, setSelectedMember] = useState<IMember[]>([])
  const [name, setName] = useState<string>("")

  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      majorId: "",
      chairman: "",
      secretary: "",
      members: [],
      category: ""
    },
  })

  const onSelectChairman = (event: DataTableSelectEvent) => {
    setChairman(event.data)
  };
  const onUnselecChairman = (event: DataTableUnselectEvent) => {
    setChairman(undefined)
  };
  const chairmanFooter = (
    <div className="flex items-center justify-center mt-4">
      <Button size="small" label="Xóa lựa chọn" icon="pi pi-trash" onClick={() => {
        setSelectedChairman(undefined)
        setChairman(undefined)
      }}
      />
      <Button size="small" label="Xác nhận" icon="pi pi-check" onClick={() => {
        setShowChairman(false)
      }} autoFocus />
    </div>
  );

  const onSelectSecretary = (event: DataTableSelectEvent) => {
    setSecretary(event.data)
  };
  const onUnselectSecretary = (event: DataTableUnselectEvent) => {
    setSecretary(undefined)
  };

  useEffect(() => {
    const filteredTeachers = listChairman?.filter(
      (teacher: any) => teacher._id !== chairman?._id
    );
    setListSeacretary(filteredTeachers);
  }, [chairman, listChairman])

  const secretaryFooter = (
    <div className="flex items-center justify-center mt-4">
      <Button size="small" label="Xóa lựa chọn" icon="pi pi-trash" onClick={() => {
        setSelectedSecretary(undefined)
        setSecretary(undefined)
      }} />
      <Button size="small" label="Xác nhận" icon="pi pi-check" onClick={() => {
        setShowSecretary(false)
      }} autoFocus />
    </div>
  );

  useEffect(() => {
    const filteredMembers = listChairman?.filter(
      (teacher: any) => teacher._id !== chairman?._id
    );

    // If secretary is selected, filter out teachers with the same _id as secretary
    const filteredMembersWithSecretary = filteredMembers?.filter(
      (teacher: any) => teacher._id !== secretary?._id
    );

    setListMember(filteredMembersWithSecretary);
  }, [chairman, secretary, listChairman]);

  const removeSelectedMember = (memberToRemove: any) => {
    const updatedMembers = selectedMembers.filter(member => member !== memberToRemove);
    setSelectedMember(updatedMembers);
  };

  const membersFooter = (
    <div className="flex items-center justify-center mt-4">
      <Button size="small" label="Xóa lựa chọn" icon="pi pi-trash" onClick={() => setSelectedMember([])} />
      <Button size="small" label="Xác nhận" icon="pi pi-check" onClick={() => {
        setShowMember(false)
      }} autoFocus />
    </div>
  );

  const isSelectable = (topicDetail: any) => selectedMembers.length < numMem;

  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    user_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    user_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

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
  const headers = getToken('token')

  const fetchTeacher = useCallback(async () => {
    const response = await axios.post(`${BASE_API_URL}/users/leader/getTeacherToReviewTopics`, {
      "filterTopic": {
        "topic_registration_period": currentPeriod?._id
      },
      "filterUser": {
        "user_major": majorID?.code
      }
    }, { headers });

    if (response.data.statusCode === 200) {
      setListChairman(response.data.data.users);
    }
  }, [currentPeriod, majorID]);


  const fetchMajor = useCallback(async () => {
    const currentPeriodResponse = await axios.get(`${BASE_API_URL}/registration_period/leader/getCurrentRegistrationPeriod`, { headers });
    const response = await axios.get(`${BASE_API_URL}/major`, { headers });

    if (response.data.statusCode === 200) {
      setMajorList(response.data.data.majors);
      setCurrentPeriod(currentPeriodResponse.data.data.registration_period);
    }
  }, []);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher, majorID]);

  useEffect(() => {
    fetchMajor();
  }, [fetchMajor]);


  const majorDropdown: IDropdown[] = majorList.map((item: IMajor) => {
    return {
      name: item.major_title,
      code: item._id
    }
  })

  const submitData = async () => {
    try {
      const membersId = selectedMembers.map(member => member._id)
      const payload = {
        assembly_name: name,
        chairman: chairman?._id,
        secretary: secretary?._id,
        members: membersId,
        assembly_major: majorID?.code
      }
      const response = await axios.post(`${BASE_API_URL}/assembly/create`, payload , { headers })
      if (response.data.statusCode == 200) {
        toast.success(response.data.message)
        window.location.reload()
      }
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  return (
    <>
      <div className="form-layout">
        <Field>
          <Label htmlFor="majorId">Chuyên ngành</Label>
          <Dropdown id="majorId" value={majorID} onChange={(e) => { setMajorID(e.value) }} options={majorDropdown} optionLabel="name" placeholder="Chọn chuyên ngành" className="w-full md:w-14rem" />
        </Field>
        <Field>
          <Label htmlFor="majorId">Số lượng thành viên</Label>
          <InputNumber className="w-full" min={1} max={3} id="number-input" value={numMem} onValueChange={(e: InputNumberValueChangeEvent) => {
            setNumMem(e.value as any)
          }} />
        </Field>
      </div>
      <Divider />
      <Field>
        <Label htmlFor="assembly_name">Tên hội đồng</Label>
        <InputText id="assembly_name" className="w-full" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} />
      </Field>
      <Divider />
      <Field>
        <Label htmlFor="topic_reviewer">Chủ tịch hội đồng</Label>
        <InputText disabled={!majorID} value={chairman?.user_name || ""} className="w-full text-sm" onClick={() => setShowChairman(true)} readOnly />
        <Dialog
          header="Chọn chủ tịch"
          visible={showChairman}
          onHide={() => {
            setShowChairman(false)
          }}
          footer={chairmanFooter}
        >
          <DataTable
            className="text-sm"
            value={listChairman}
            removableSort
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            tableStyle={{ width: '50rem' }}
            // loading={loading}
            onRowSelect={onSelectChairman}
            onRowUnselect={onUnselecChairman}
            dataKey="user_id"
            selectionMode='single'
            selection={selectedChairman!}
            onSelectionChange={(e) => setSelectedChairman(e.value)}
            filters={filters} globalFilterFields={['user_name', 'user_id']}
            header={headerDialog}
            emptyMessage="Không tìm thấy kết quả">
            <Column selectionMode="single" />
            <Column field="email" header="Email" />
            <Column field="user_name" sortable header="Họ tên" />
            <Column field="user_id" sortable header="Mã số" />
            <Column field="totalIntructTopics" align="center" header="ĐTHD" />
            <Column field="totalReviewTopics" align="center" header="ĐTPB" />
            <Column field="totalAssembly" align="center" header="Hội đồng" />
          </DataTable>
        </Dialog>
      </Field>
      <Divider />
      <Field>
        <Label htmlFor="secretary">Thư ký hội đồng</Label>
        <InputText disabled={!chairman} value={secretary?.user_name || ""} className="w-full text-sm" onClick={() => setShowSecretary(true)} readOnly />
        <Dialog
          header="Chọn thư ký"
          visible={showSecretary}
          onHide={() => {
            setShowSecretary(false)
          }}
          footer={secretaryFooter}
        >
          <DataTable
            className="text-sm"
            value={listSecretary}
            removableSort
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            tableStyle={{ width: '50rem' }}
            // loading={loading}
            onRowSelect={onSelectSecretary}
            onRowUnselect={onUnselectSecretary}
            dataKey="user_id"
            selectionMode='single'
            selection={selectedSecretary!}
            onSelectionChange={(e) => setSelectedSecretary(e.value)}
            filters={filters} globalFilterFields={['user_name', 'user_id']}
            header={headerDialog}
            emptyMessage="Không tìm thấy kết quả">
            <Column selectionMode="single" />
            <Column field="email" header="Email" />
            <Column field="user_name" sortable header="Họ tên" />
            <Column field="user_id" sortable header="Mã số" />
            <Column field="totalIntructTopics" align="center" header="ĐTHD" />
            <Column field="totalReviewTopics" align="center" header="ĐTPB" />
            <Column field="totalAssembly" align="center" header="Hội đồng" />
          </DataTable>
        </Dialog>
      </Field>
      <Divider />
      <Field>
        <div className="flex justify-center items-center gap-x-3 mb-3">
          <Label htmlFor="topic_reviewer">Thành viên hội đồng</Label>
          <Button size="small" disabled={!chairman || !secretary} type="button" label="Chọn thành viên" icon="pi pi-external-link" onClick={() => setShowMember(true)} />
        </div>
        {
          selectedMembers?.map((member, index)=>{
            return (
              <div key={member._id}>{index + 1}. {member.user_name} <span className="pi pi-trash cursor-pointer hover:text-red-500" onClick={() => removeSelectedMember(member)} ></span></div>
            )
          })
        }
        <Dialog
          header="Chọn thành viên"
          visible={showMember}
          onHide={() => {
            setShowMember(false)
          }}
          footer={membersFooter}
        >
          <DataTable
            className="text-sm"
            value={listMember}
            removableSort
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10]}
            tableStyle={{ width: '50rem' }}
            dataKey="user_id"
            selectionMode='multiple'
            selection={selectedMembers!}
            onSelectionChange={(e) => setSelectedMember(e.value)}
            isDataSelectable={isSelectable}
            filters={filters} globalFilterFields={['user_name', 'user_id']}
            header={headerDialog}
            emptyMessage="Không tìm thấy kết quả">
            <Column selectionMode="multiple" />
            <Column field="email" header="Email" />
            <Column field="user_name" sortable header="Họ tên" />
            <Column field="user_id" sortable header="Mã số" />
            <Column field="totalIntructTopics" align="center" header="ĐTHD" />
            <Column field="totalReviewTopics" align="center" header="ĐTPB" />
            <Column field="totalAssembly" align="center" header="Hội đồng" />
          </DataTable>
        </Dialog>
      </Field>
      <Divider />
      <div className="flex justify-center">
        <Button size="small" label="Tạo hội đồng" icon="pi pi-plus" onClick={() => submitData()}/>
      </div>
    </>
  );
};

export default LeaderCreateAssembly;
