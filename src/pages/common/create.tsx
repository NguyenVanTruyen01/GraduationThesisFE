import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { IRegisterPayload } from "@/types/auth.type";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import * as React from 'react';
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputMask } from "primereact/inputmask";
import { Calendar } from "primereact/calendar";
import moment from "moment";
import { InputText } from "primereact/inputtext";
import { Fragment, useEffect, useState } from "react";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import toast from "react-hot-toast"
import { IDropdown, IFaculty, IMajor } from "@/types/interface";
import { FileUpload } from "primereact/fileupload";

interface IAddUserProps {
}

const UserCreate: React.FC<IAddUserProps> = (props) => {

  const [faculty, setFaculty] = useState<IFaculty[]>([])
  const [major, setMajor] = useState<IMajor[]>([])
  const [loading, setLoading] = useState(true)
  const [fileData, setFileData] = useState<any>(null)

  const fetchData = async () => {
    try {
      const facultyRes = await axios.get(`${BASE_API_URL}/faculty`, { headers })
      const majorRes = await axios.get(`${BASE_API_URL}/major`, { headers })

      if (facultyRes.status === 200 && majorRes.status === 200) {
        setFaculty(facultyRes.data.data.faculties)
        setMajor(majorRes.data.data.majors)
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


  const roles: IDropdown[] = [
    { name: 'Giảng viên', code: 'TEACHER' },
    { name: 'Sinh viên', code: 'STUDENT' }
  ];

  const majors: IDropdown[] = major.map((item: IMajor) => {
    return {
      name: item.major_title,
      code: item._id
    }
  })

  const faculties: IDropdown[] = faculty.map((item: IFaculty) => {
    return {
      name: item.faculty_title,
      code: item._id
    }
  })

  const { control, formState: { errors }, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      user_id: "",
      user_name: "",
      user_date_of_birth: "",
      user_phone: "",
      user_permanent_address: "",
      user_temporary_address: "",
      user_department: "",
      user_faculty: "",
      user_major: "",
      role: ""
    },
  })
  const navigate = useNavigate()
  const headers = getToken('token')

  const userToken = JSON.parse(localStorage.getItem('token') || '{}')
  const header = {
    'Authorization': `${userToken}`,
    'Content-Type': 'multipart/form-data'
  }

  console.log("userToken", userToken);

  const onSubmit = async (values: IRegisterPayload) => {
    try {
      const payload = {
        ...values,
        user_date_of_birth: moment(values.user_date_of_birth).toISOString(),
        role: values?.role?.code,
        user_faculty: values?.user_faculty?.code,
        user_major: values?.user_major?.code,
      }

      const response = await axios.post(`${BASE_API_URL}/users/signup`, payload, { headers })
      console.log("response", response);
      if (response.data.statusCode === 200) {
        toast.success("Đăng ký thành công")
        window.history.back()
      }
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const onFileChange = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setFileData(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const handleUpload = async (event: any) => {
    let formData = new FormData();
    formData.append('insert_user', fileData)

    try {
      const response = await axios.post(`${BASE_API_URL}/users/leader/insertUserByExcel`, formData, { headers: header })
      if (response.data.statusCode == 200) {
        toast.success("Tải lên danh sách thành công!");
      } else {
        toast.error("Tải lên danh sách thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra trong quá trình xử lý");
    }
  }

  return (
    <Fragment>
      <section className="card m-[1rem]">
        <div className="flex items-center mb-6">
          <i className="fa-solid fa-pencil" />
          <span className="ml-3 text-xl font-bold">Thêm người dùng</span>
        </div>
        <form className="grid grid-cols-1 gap-4 text-sm" onSubmit={handleSubmit(onSubmit as any)} autoComplete="false">
          <div className="form-layout2">
            <Field>
              <Label htmlFor="email">Email</Label>
              <Controller
                name="email"
                control={control}
                rules={{ required: 'Vui lòng nhập email' }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`${classNames({ 'p-invalid': fieldState.error })}  w-full text-sm`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Nhập email"
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="user_name">Họ và tên</Label>
              <Controller
                name="user_name"
                control={control}
                rules={{ required: 'Vui lòng nhập họ và tên' }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Nhập họ và tên"
                    />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="user_id">Mã số</Label>
              <Controller
                name="user_id"
                control={control}
                rules={{ required: 'Vui lòng nhập mã số ' }}
                render={({ field, fieldState }) => (
                    <InputMask
                      id={field.name}
                      value={field.value}
                      className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
                      onChange={(e) => field.onChange(e.target.value)}
                      mask="99999999"
                      placeholder="Mã số 8 số"
                    />
                )}
              />
            </Field>
          </div>
          <div className="form-layout2">
            <Field>
              <Label htmlFor="password">Mật khẩu</Label>
              <Controller
                name="password"
                control={control}
                rules={{ required: 'Vui lòng nhập mật khẩu' }}
                render={({ field, fieldState }) => (
                  <InputText
                    id={field.name}
                    value={field.value}
                    className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full `}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Nhập mật khẩu"
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="user_date_of_birth">Ngày sinh</Label>
              <Controller
                name="user_date_of_birth"
                control={control}
                rules={{ required: 'Vui lòng chọn ngày sinh' }}
                render={({ field, fieldState }) => (
                  <Calendar
                    inputId={field.name}
                    value={field.value as any}
                    onChange={field.onChange}
                    dateFormat="dd/mm/yy"
                    className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                    placeholder="Chọn ngày sinh"
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="user_phone">Số điện thoại</Label>
              <Controller
                name="user_phone"
                control={control}
                rules={{ required: 'Vui lòng nhập số điện thoại' }}
                render={({ field, fieldState }) => (
                  <InputMask
                    id={field.name}
                    value={field.value}
                    className={`${classNames({ 'p-invalid': fieldState.error })} !text-sm w-full`}
                    onChange={(e) => field.onChange(e.target.value)}
                    mask="9999999999"
                    placeholder="Số điện thoại 10 số"
                  />
                )}
              />
            </Field>
          </div>
          <div className="form-layout2">
            <Field>
              <Label htmlFor="user_faculty">Khoa</Label>
              <Controller
                name="user_faculty"
                control={control}
                rules={{ required: 'Vui lòng chọn khoa' }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionLabel="name"
                    placeholder="Chọn khoa"
                    options={faculties}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={`${classNames({ 'p-invalid': fieldState.error })} text-sm w-full`}

                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="user_major">Chuyên ngành</Label>
              <Controller
                name="user_major"
                control={control}
                rules={{ required: 'Vui lòng chọn chuyên ngành' }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionLabel="name"
                    placeholder="Chọn chuyên ngành"
                    options={majors}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={`${classNames({ 'p-invalid': fieldState.error })} text-sm w-full`}
                  />
                )}
              />
            </Field>
            <Field>
              <Label htmlFor="role">Vai trò</Label>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Vui lòng chọn vai trò' }}
                render={({ field, fieldState }) => (
                  <Dropdown
                    id={field.name}
                    value={field.value}
                    optionLabel="name"
                    placeholder="Vai trò"
                    options={roles}
                    focusInputRef={field.ref}
                    onChange={(e) => field.onChange(e.value)}
                    className={`${classNames({ 'p-invalid': fieldState.error })}  text-sm w-full`}
                  />
                )}
              />
            </Field>
          </div>
          <div className="flex justify-end text-sm">
            <Button size="small" type="submit" label="Tạo người dùng" icon="pi pi-plus" />
          </div>
        </form>
        {/* </section> */}
      </section>
      <div className="card m-[1rem]">
        <div className="flex items-center mb-6">
          <i className="pi pi-upload" />
          <span className="mx-3 text-xl font-bold">Import người dùng</span>
          <a className="border-none text-sm border-borderColor rounded-lg p-1 text-green-500 font-bold"
            href="/file_mau.xlsx" target="_blank" download>
            <span className="pi pi-download" /> File mẫu
          </a>
        </div>
        <div className="">
          <input id="file" type="file" onChange={onFileChange} />
          <Button label="Tải lên" icon="pi pi-upload" size="small" onClick={handleUpload} />
        </div>
      </div>
    </Fragment>
  );
};

export default UserCreate;
