import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/edit-profile.module.scss'
import Image from '@/components/image/Image'
import axios from 'axios'
import { BASE_API_URL } from '@/utils/globalVariables'
import Notify from '@/utils/Toast'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import StudentAPI from '@/apis/student/student.api'
import useStorage from '@/hooks/useStorage'
import LeaderAPI from '@/apis/leader/leader.api'
import { Dialog } from 'primereact/dialog'
import "./Profile.scss"
import toast from 'react-hot-toast'
import Field from "@/components/field/Field"
import Label from "@/components/label/Label"
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext"
import moment from "moment"
import { IDropdown, IFaculty, IMajor } from "@/types/interface"
import Loading from "@/components/loading/Loading"


type Inputs = {
  user_name: string
  email: string
  user_id: string
  user_CCCD: string
  user_phone: string
  user_permanent_address: string
  user_temporary_address: string
  user_average_grade: number
  user_faculty: string
  user_major: string
  user_date_of_birth: string
}

const LeaderProfile = () => {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [listMajors, setListMajors] = useState<IMajor[]>([])
  const [listFaculties, setListFaculties] = useState<IFaculty[]>([])
  const { control, handleSubmit, formState: { errors }, } = useForm<Inputs>()


  let currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const userToken = JSON.parse(localStorage.getItem('token') || '{}')

  const headers = {
    'Authorization': `${userToken}`,
    'Content-Type': 'multipart/form-data'
  }

  const [visible, setVisible] = useState<boolean>(false);

  //Lưu avatar khi thay đổi
  const [imagesAvatar, setImagesAvatar] = useState<any>([]);

  const [onChangeAvatar, setOnChangeAvatar] = useState<any>(false)

  const [avatar, setAvatar] = useState<any>(null)

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

  const handleUploadAvatar = async (event: any) => {
    if (!avatar) {
      toast.error('Vui lòng chọn ảnh đại diện mới!')
      return;
    }

    let formData = new FormData();
    formData.append('avatar', avatar);

    await axios.post(`${BASE_API_URL}/users/leader/updateAvatar`, formData, { headers })
      .then(result => {

        // Thay đổi giá trị của currentUser
        currentUser.user_avatar = result.data.data.user.user_avatar;

        // Convert lại thành chuỗi JSON và lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));
        toast.success("Cập nhật ảnh đại diện thành công!");
        setVisible(false);
      }).catch(err => {
        toast.error("Cập nhật ảnh đại diện thất bại!");
      })
  }

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      console.log("JSON:" + JSON.stringify(data))
      let newData =
      {
        user_name: data?.user_name || user?.user_name,
        user_CCCD: data?.user_CCCD || user?.user_CCCD,
        user_phone: data?.user_phone || user?.user_phone,
        user_permanent_address: data?.user_permanent_address || user?.user_permanent_address,
        user_temporary_address: data?.user_temporary_address || user?.user_temporary_address,
        user_date_of_birth: moment(data?.user_date_of_birth).toISOString() || user?.user_date_of_birth,
      }

      const result: any = await LeaderAPI.updateProfile(newData);

      if (result?.statusCode === 200) {
        toast.success(result?.message)
        localStorage.setItem("user", JSON.stringify(result?.data?.user));
      }
      else {
        toast.error("Cập nhật thông tin thất bại")
      }
    } catch (error: any) {
      toast.error("Xảy ra lỗi trong quá trình xử lý")
    }
  }

  const fetchProfile = useCallback(async () => {
    return await LeaderAPI.getProfile(currentUser?._id);
  }, [])

  useEffect(() => {
    fetchProfile().then((result: any) => {
      if (result?.statusCode === 200) {
        setUser(result?.data?.user)
        setLoading(false)
      }
      else {
        toast.error("Xảy ra lỗi trong quá trình xử lý")
      }
    })
      .catch((err: any) => {
        toast.error("Xảy ra lỗi trong quá trình xử lý")
      })
  }, [])


  const fetchMajor = useCallback(async () => {
    const response = await axios.get(`${BASE_API_URL}/major`, { headers });
    if (response.data.statusCode === 200) {
      setListMajors(response.data.data.majors);
    }
  }, []);

  const fetchFaculty = useCallback(async () => {
    const response = await axios.get(`${BASE_API_URL}/faculty`, { headers });
    if (response.data.statusCode === 200) {
      setListFaculties(response.data.data.faculties);
    }
  }, []);

  useEffect(() => {
    fetchMajor();
    fetchFaculty();
  }, [fetchMajor, fetchFaculty]);

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
      <div className="w-full flex items-center justify-between">
        <div className="w-[26%] shadow-xl rounded-lg py-5">
          <div className="flex justify-center items-center w-full relative">
            <div className="w-[130px] h-[130px] border border-blue-500 p-1 rounded-full box-border overflow-hidden">
              <Image image={currentUser.user_avatar !== '' ? `${BASE_API_URL}/${currentUser?.user_avatar}` : `/public/avatar.jpg`} />
            </div>
            <div className="absolute bottom-0 right-[88px] flex justify-center items-center w-[30px] h-[30px] rounded-full text-sm text-white cursor-pointer bg-blue-400" onClick={() => setVisible(true)}>
              <i className="pi pi-camera"></i>
            </div>
          </div>
          <Dialog
            header="Thay đổi ảnh đại diện"
            visible={visible}
            onHide={() => setVisible(false)}
            style={{ width: '30rem', height: '30rems' }}
            className='custom-dialog'
          >
            <div className="modal-changeAvatar mt-5">
              <div className="author-changeAvatar">
                <div className="profile-author-change">
                  <img
                    className="avatar"
                    alt="author"
                    style={{ background: "#ffffff" }}
                    src={onChangeAvatar && imagesAvatar.length > 0
                      ? URL.createObjectURL(imagesAvatar[0])
                      : '/public/avatar.jpg'
                    }
                  />

                  <div className="edit-dp">
                    <label className="fileContainer">
                      <i className="pi pi-camera"></i>
                      <input type="file" onChange={handleOnChangeAvatar} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="group-action">
                <div className="group-btn">
                  <button
                    type="button"
                    className="cancel"
                    onClick={() => {
                      setOnChangeAvatar(false);
                      setVisible(false);
                    }}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    className="save"
                    onClick={handleUploadAvatar}
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </Dialog>

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
                      <InputText id={field.name} defaultValue={user?.email} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} disabled />
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
                      <InputText id={field.name} defaultValue={user?.user_id} value={field.value} className="p-inputtext-sm w-full" onChange={(e) => field.onChange(e.target.value)} disabled />
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
                  <Label htmlFor="user_phone">Số điện thoại</Label>
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
                        disabled
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
                        disabled
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
}

export default LeaderProfile
