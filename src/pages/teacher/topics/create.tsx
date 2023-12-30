// import Button from "@/components/button/Button"
import Field from "@/components/field/Field"
import Input from "@/components/input/Input"
import Label from "@/components/label/Label"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import * as Yup from 'yup'
import DropdownPeriod from "@/components/dropdown/DropdownPeriod"
import Loading from '@/components/loading/Loading';
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable, DataTableDataSelectableEvent, DataTableFilterMeta, DataTableSelectEvent, DataTableUnselectEvent } from "primereact/datatable"
import { Column } from 'primereact/column';
import { InputText } from "primereact/inputtext"
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { getToken } from "@/hooks/useGetToken"
import { InputTextarea } from "primereact/inputtextarea"
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber"
import { Dropdown } from "primereact/dropdown"
import { classNames } from "primereact/utils"
import { IDropdown, ITopicCategory, IUser } from "@/types/interface"
import { Fieldset } from "primereact/fieldset"

const TopicCreate = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    user_name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    user_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

  const [registrationPeriod, setRegistrationPeriod] = useState()
  const [listStudents, setListStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [maxStudents, setMaxStudents] = useState<number>(1)
  const [value, setValue] = useState<string>("");
  const [topicCategory, setTopicCategory] = useState<ITopicCategory[]>([]);
  const [choiced, setChoiced] = useState(0);

  const onRowSelect = (event: DataTableSelectEvent) => {
    setChoiced(event.data._id)
  };

  const onRowUnselect = (event: DataTableUnselectEvent) => {
    setChoiced(0)
  };

  // const isSelectable = (topicDetail: any) => topicDetail.topic_teacher_status == "REGISTERED";
  const isSelectable = (topicDetail: any) => selectedProducts.length < maxStudents;

  const isRowSelectable = (event: DataTableDataSelectableEvent) => (event.data ? isSelectable(event.data) : true);

  const footerContent = (
    <div className="flex items-center justify-center mt-4">
      <Button size="small" label="Xóa lựa chọn" icon="pi pi-trash" onClick={() => setSelectedProducts([])} />
      <Button size="small" label="Xác nhận" icon="pi pi-check" onClick={() => {
        setVisible(false)
      }} autoFocus />
    </div>
  );


  const { control, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      topic_registration_period: "",
      topic_category: "",
      topic_title: "",
      topic_description: "",
      topic_max_members: 0,
      topic_group_student: []
    },
  })
  const navigate = useNavigate()
  const headers = getToken('token')

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      user_name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
      user_id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    setGlobalFilterValue('');
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const period = await axios.get(`${BASE_API_URL}/registration_period/teacher/getCurrentRegistrationPeriod`, { headers })
        const listStudents = await axios.post(`${BASE_API_URL}/users/teacher/search`, {
          role: "STUDENT"
        }, { headers })
        const category = await axios.get(`${BASE_API_URL}/topic_category/getAll`, { headers })
        if (period.status === 200) {


          setRegistrationPeriod(period.data.data.registration_period)
          setListStudents(listStudents.data.data.users)
          setTopicCategory(category.data.data.topic_categorys)
          setLoading(false)
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          toast.error("Chưa có đợt đăng ký");
          window.history.back()
        } else {
          console.error(error);
        }
      }
    }
    fetchData()
    initFilters();
  }, []);

  const categories: IDropdown[] = topicCategory.map((item: ITopicCategory) => {
    return {
      name: item.topic_category_title,
      code: item._id
    }
  })

  const onSubmit = async (data: any) => {

    const studentArr: string[] = []
    selectedProducts?.forEach((value: any) => {
      studentArr.push(value._id)
    })
    try {
      const numberStudent = Number(maxStudents)
      const payload = {
        ...data,
        topic_max_members: numberStudent,
        topic_group_student: studentArr,
        topic_description: value,
        topic_category: data.topic_category.code
      }

      const response = await axios.post(`${BASE_API_URL}/topics/teacher/createTopic`, payload, { headers })
      if (response.data.statusCode === 200) {
        if (studentArr?.length > 0) {
          const res = await axios.patch(`${BASE_API_URL}/topics/teacher/updateById/${response.data.data.topic._id}`, {
            topic_teacher_status: "REGISTERED",
            topic_leader_status: "PENDING"
          }, { headers })
          if (res.data.statusCode === 200) {
            toast.success(res.data.message);
            navigate("/teacher/topics/mentor");
          }
        }
        else {
          toast.success("Đăng ký thành công");
          navigate("/teacher/topics/pending");
        }

      } else {
        // Handle other success status codes or provide additional feedback here.
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message)
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }

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
          <InputText className="px-3 py-4" value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
        </span>
      </div>
    );
  };

  const header = renderHeader();
  return (
    <section className="card m-[2rem]">
      <div className="flex items-center mb-6">
        <span className="text-base font-bold">THÊM ĐỀ TÀI MỚI</span>
      </div>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-layout text-sm w-full flex flex-col gap-5">

          <Fieldset className="border border-borderColor text-sm font-medium w-full" legend="Học kỳ">
            <DropdownPeriod control={control} name="topic_registration_period" period={registrationPeriod} text="Chọn học kỳ" />
          </Fieldset>

          <Fieldset className="border border-borderColor text-sm font-medium w-full" legend="Loại đề tài">
            <Controller
              name="topic_category"
              control={control}
              rules={{ required: 'City is required.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  optionLabel="name"
                  placeholder="Vui lòng chọn"
                  options={categories}
                  focusInputRef={field.ref}
                  onChange={(e) => field.onChange(e.value)}
                  className={`${classNames({ 'p-invalid': fieldState.error })} w-full border border-borderColor`}
                />
              )}
            />
          </Fieldset>

        </div>

        <Fieldset className="border border-borderColor text-sm font-medium" legend="Tên đề tài">
          <Input
            control={control}
            placeholder="Nhập tên đề tài"
            name="topic_title"
          />
        </Fieldset>

        <div className="form-layout text-sm w-full flex flex-col gap-5">
          <Fieldset className="border border-borderColor text-sm font-medium" legend="Số lượng sinh viên thực hiện">
            <InputNumber value={maxStudents} onValueChange={(e: InputNumberValueChangeEvent) => setMaxStudents(e.value as any)} min={1} max={3} showButtons buttonLayout="horizontal" step={1} className="!text-center w-full"
              incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"
            />
          </Fieldset>

          <Fieldset className="border border-borderColor text-sm font-medium" legend="Số lượng sinh viên thực hiện">
            <Button className="text-base" disabled={maxStudents === 0} label="Chọn sinh viên" icon="pi pi-external-link" onClick={() => setVisible(true)} />
            <Dialog header="Chọn sinh viên thực hiện đề tài" visible={visible} onHide={() => setVisible(false)} footer={footerContent}>
              <DataTable value={listStudents} removableSort paginator rows={5} rowsPerPageOptions={[5, 10]} tableStyle={{ minWidth: '50rem' }} loading={loading} onRowSelect={onRowSelect} onRowUnselect={onRowUnselect} dataKey="user_id" selectionMode='multiple' selection={selectedProducts!} onSelectionChange={(e) => setSelectedProducts(e.value)} isDataSelectable={isSelectable}
                filters={filters} globalFilterFields={['user_name', 'user_id', 'representative.name', 'balance', 'status']} header={header}
                emptyMessage="Không tìm thấy kết quả">
                <Column selectionMode="multiple" style={{ width: '0%' }} />
                <Column field="email" sortable header="Email" style={{ width: '25%' }} />
                <Column field="user_name" sortable filter header="Họ tên" style={{ width: '25%' }} />
                <Column field="user_id" sortable filter header="MSSV" style={{ width: '25%' }} />
              </DataTable>
            </Dialog>
          </Fieldset>
        </div>

        <Fieldset className="border border-borderColor text-sm font-medium" legend="Danh sách sinh viên được chọn">
          <Field>
            {selectedProducts.length <= 0 && (
              <span>Chưa chọn sinh viên nào</span>
            )}
            {
              selectedProducts.length > 0 && (
                <div>
                  {selectedProducts.length > 0 && (
                    <div>
                      <ul>
                        {selectedProducts.map((user: IUser) => (
                          <li className="flex" key={user._id}>
                            <div style={{ minWidth: "350px" }}>{user.user_name}</div>
                            <div>{user.user_id}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            }
          </Field>
        </Fieldset>

        <div className="w-full">
          <Fieldset className="border border-borderColor text-sm font-medium" legend="Mô tả chi tiết đề tài">
            <InputTextarea className="border w-full p-4 text-sm" placeholder="Nhập mô tả đề tài" autoResize value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} />
          </Fieldset>
        </div>

        <div className="flex justify-center">
          <Button size="small" disabled={value == ""} type="submit" label="Tạo đề tài" icon="pi pi-plus" />
        </div>
      </form>
    </section >
  )
}

export default TopicCreate