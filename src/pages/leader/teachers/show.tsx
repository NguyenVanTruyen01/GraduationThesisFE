import * as React from 'react';
import { useCallback, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import { BASE_API_URL } from "@/utils/globalVariables";
import { useParams } from "react-router-dom";
import { getToken } from "@/hooks/useGetToken";
import { IDropdown, IFaculty, IMajor, IUser } from "@/types/interface";
import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Image from '@/components/image/Image'
import Loading from "@/components/loading/Loading";
import moment from "moment";
import { Toast } from "primereact/toast";

interface ILeaderLeaderShowProps {
}

type Inputs = {
  user_name: string
  email: string
  user_id: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_faculty: string
  user_major: string
  user_date_of_birth: string
}

const LeaderLeaderShow: React.FunctionComponent<ILeaderLeaderShowProps> = (props) => {
  const { teacherID } = useParams()
  const toast = useRef<Toast>(null);

  const headers = getToken("token")
  const [loading, setLoading] = useState<boolean>(true)
  const [scoreUpload, setScoreUpload] = useState<any>(null)
  const [listMajors, setListMajors] = useState<IMajor[]>([])
  const [listFaculties, setListFaculties] = useState<IFaculty[]>([])
  const [user, setUser] = useState<IUser>()

  const { register, control, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()

  const [visible, setVisible] = useState<boolean>(false);

  //Lưu avatar khi thay đổi
  const [imagesAvatar, setImagesAvatar] = useState<any>([]);

  const [onChangeAvatar, setOnChangeAvatar] = useState<any>(false)

  const [avatar, setAvatar] = useState<any>(null)

  const showError = () => {
    toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: 'Xảy ra lỗi trong quá trình xử ly', life: 3000 });
  }

  const showSuccess = () => {
    toast.current?.show({ severity: 'success', summary: 'Thành công ', detail: 'Thành công', life: 3000 });
  }

  const handleOnChangeAvatar = (e: any) => {

    onFileChangeAvatar(e)

    const selectedImage = e.target.files[0];
    setImagesAvatar([selectedImage]);

    setOnChangeAvatar(true);
  };

  const onFileChangeAvatar = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setAvatar(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      let payload =
      {
        user_name: data?.user_name || user?.user_name,
        email: data?.email || user?.email,
        user_id: data?.user_id || user?.user_id,
        user_CCCD: data?.user_CCCD || user?.user_CCCD,
        user_phone: data?.user_phone || user?.user_phone,
        user_permanent_address: data?.user_permanent_address || user?.user_permanent_address,
        user_temporary_address: data?.user_temporary_address || user?.user_temporary_address,
        user_faculty: data?.user_faculty?.code || user?.user_faculty._id,
        user_major: data?.user_major?.code || user?.user_major._id,
        user_date_of_birth: moment(data?.user_date_of_birth).toISOString() || user?.user_date_of_birth,
      }

      const response = await axios.patch(`${BASE_API_URL}/users/leader/updateById/${teacherID}`, payload, { headers })

      if (response.data.statusCode == 200) {
        showSuccess()
      } else {
        showError()
      }
    } catch (error: any) {
      showError()
    }
  }
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/users/leader/findById/${teacherID}`, { headers });
      if (response.data.statusCode === 200) {
        setUser(response.data.data.user);
        setLoading(false);
      }
    } catch (error) {
      showError();
    }
  }, [teacherID, headers]);

  const fetchMajor = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/major`, { headers });
      if (response.data.statusCode === 200) {
        setListMajors(response.data.data.majors);
      }
    } catch (error) {
      showError();
    }
  }, [headers]);

  const fetchFaculty = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_API_URL}/faculty`, { headers });
      if (response.data.statusCode === 200) {
        setListFaculties(response.data.data.faculties);
      }
    } catch (error) {
      showError();
    }
  }, [headers]);

  useEffect(() => {
    fetchCurrentUser();
    fetchMajor();
    fetchFaculty();
  }, [fetchCurrentUser, fetchMajor, fetchFaculty]);

  const majorDropdown: IDropdown[] = listMajors.map((item: IMajor) => {
    return {
      name: item.major_title,
      code: item._id
    }
  })

  const facultyDropdown: IDropdown[] = listFaculties.map((item: IFaculty) => {
    return {
      name: item.faculty_title,
      code: item._id
    }
  })

  if (loading) {
    return <Loading />
  }

  return (
    <section className="card m-[1rem]">
      <Toast ref={toast} />
      <div className=" w-full flex items-center justify-between">
        <div className="w-[26%] shadow-xl rounded-lg py-5">
          <div className="flex justify-center items-center w-full relative">
            <div className="w-[130px] h-[130px] border border-blue-500 p-1 rounded-full box-border overflow-hidden">
              <Image image={user?.user_avatar !== '' ? `${BASE_API_URL}/${user?.user_avatar}` : `/public/avatar.jpg`} />
            </div>
            <div className="absolute bottom-0 right-[88px] flex justify-center items-center w-[30px] h-[30px] rounded-full text-sm text-white cursor-pointer bg-blue-400" onClick={() => setVisible(true)}>
              <i className="fa fa-camera"></i>
            </div>
          </div>

          <div className="mt-[50px] text-center flex items-center justify-center font-medium text-xl mb-10">
            <p className="w-full p-4">{user?.user_name}</p>
          </div>
          <div className="w-full border-t border-whiteSoft">
            <p className="w-full py-5 px-[5%] flex justify-between items-center"><span className="font-medium text-sm">Mã số</span> <span className="text-sm">{`${user !== null ? user?.user_id : ""}`}</span></p>
          </div>
          <div className="w-full border-t border-whiteSoft">
            <p className="w-full py-5 px-[5%] flex justify-between items-center"><span className="font-medium text-sm">Email</span> <span className="text-sm">{`${user !== null ? user?.email : ""}`}</span></p>
          </div>
          <div className="w-full border-t border-whiteSoft">
            <p className="w-full py-5 px-[5%] flex justify-between items-center"><span className="font-medium text-sm">SĐT</span> <span className="text-sm">{`${user !== null ? user?.user_phone : ""}`} </span></p>
          </div>
          <div className="w-full border-t border-whiteSoft">
            <p className="w-full py-5 px-[5%] flex justify-between items-center"><span className="font-medium text-sm">Vai trò</span><span className="text-sm">{`${user !== null ? user?.role : ""}`} </span></p>
          </div>
        </div>

        <div className="w-[70%] shadow-xl bg-white pb-3 rounded-lg">
          <form className="" onSubmit={handleSubmit(onSubmit)}>

            <div className="w-full py-3 px-[5%] flex flex-col">
              <h6 className="text-[#303972] text-xl pb-2">Thông tin tài khoản</h6>
              <div className="form-layout">
                <Field>
                  <Label htmlFor="user_name">Họ và tên</Label>
                  <Controller
                    name="user_name"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user?.user_name} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
                <Field>
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user?.email} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
              </div>
              <div className="form-layout">
                <Field>
                  <Label htmlFor="user_id">Mã số</Label>
                  <Controller
                    name="user_id"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user?.user_id} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
                <Field>
                  <Label htmlFor="user_CCCD">CCCD</Label>
                  <Controller
                    name="user_CCCD"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user !== null ? user?.user_CCCD : ""} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
              </div>
              <div className="form-layout">
                <Field>
                  <Label htmlFor="user_phone">Số  điện thoại</Label>
                  <Controller
                    name="user_phone"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user !== null ? user?.user_phone : ""} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
                <Field>
                  <Label htmlFor="user_permanent_address">Địa chỉ</Label>
                  <Controller
                    name="user_permanent_address"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user !== null ? user?.user_permanent_address : ""} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
              </div>
              <div className="form-layout">
                <Field>
                  <Label htmlFor="user_temporary_address">Địa chỉ tạm thời</Label>
                  <Controller
                    name="user_temporary_address"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user !== null ? user?.user_temporary_address : ""} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
                <Field>
                  <Label htmlFor="user_date_of_birth">Ngày sinh</Label>
                  <Controller
                    name="user_date_of_birth"
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText id={field.name} defaultValue={user !== null ? moment(user?.user_date_of_birth).format("DD/MM/YYYY") : ""} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} />
                    )}
                  />
                </Field>
              </div>
              <div className="form-layout">
                <Field>
                  <Label htmlFor="user_faculty">Khoa</Label>
                  <Controller
                    name="user_faculty"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="name"
                        placeholder={user !== null ? user?.user_faculty.faculty_title : ""}
                        options={facultyDropdown}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        className="w-full"
                      />
                    )}
                  />
                </Field>
                <Field>
                  <Label htmlFor="user_major">Chuyên ngành</Label>
                  <Controller
                    name="user_major"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        value={field.value}
                        optionLabel="name"
                        placeholder={user !== null ? user?.user_major.major_title : ""}
                        options={majorDropdown}
                        focusInputRef={field.ref}
                        onChange={(e) => field.onChange(e.value)}
                        className="w-full"
                      />
                    )}
                  />
                </Field>
              </div>

              <div className="w-full flex justify-end">
                <button className="py-3 px-5 text-sm bg-blue-400 text-white  font-medium rounded-lg">Cập nhật</button>
              </div>
            </div>
          </form>
        </div>

      </div>
    </section>
  )
};

export default LeaderLeaderShow;
