import React, { useCallback, useEffect, useState } from 'react'
import styles from './styles/edit-profile.module.scss'
import Image from '@/components/image/Image'
import axios from 'axios'
import { BASE_API_URL } from '@/utils/globalVariables'
import Notify from '@/utils/Toast'
import { SubmitHandler, useForm } from 'react-hook-form'
import StudentAPI from '@/apis/student/student.api'
import useStorage from '@/hooks/useStorage'
import { Dialog } from 'primereact/dialog'
import "./EditProfile.scss"
import toast from 'react-hot-toast'
import Loading from '@/components/loading/Loading'


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
}

const EditProfile = () => {

  let currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  const userToken = JSON.parse(localStorage.getItem('token') || '{}')

  const headers = {
    'Authorization': `${userToken}`,
    'Content-Type': 'multipart/form-data'
  }

  const [loading, setLoading] = useState(true)

  const [scoreUpload, setScoreUpload] = useState<any>(null)

  const { register, handleSubmit, watch, formState: { errors }, } = useForm<Inputs>()

  const [user, setUser] = useState<any>(null)

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

    await axios.post(`${BASE_API_URL}/users/student/updateAvatar`, formData, { headers })
      .then(result => {

        // Thay đổi giá trị của currentUser
        currentUser.user_avatar = result.data.data.user.user_avatar;

        // Convert lại thành chuỗi JSON và lưu vào localStorage
        localStorage.setItem('user', JSON.stringify(currentUser));

        Notify("Cập nhật ảnh đại diện thành công!");

        setVisible(false);

      }).catch(err => {
        Notify("Cập nhật ảnh đại diện thất bại!");
      })

  }

  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    try {
      let newData =
      {
        user_name: data?.user_name.length > 0 ? data?.user_name : currentUser?.user_name,
        email: data?.email.length > 0 ? data?.email : currentUser?.email,
        user_id: data?.user_id.length > 0 ? data?.user_id : currentUser?.user_id,
        user_CCCD: data?.user_CCCD.length > 0 ? data?.user_CCCD : currentUser?.user_CCCD,
        user_phone: data?.user_phone.length > 0 ? data?.user_phone : currentUser?.user_phone,
        user_permanent_address: data?.user_permanent_address.length > 0 ? data?.user_permanent_address : currentUser?.user_permanent_address,
        user_temporary_address: data?.user_temporary_address.length > 0 ? data?.user_temporary_address : currentUser?.user_temporary_address,
        user_average_grade: Number(data?.user_average_grade),
        // user_faculty: string
        // user_major: string
        // "topic_registration_period":period,
        // "topic_title": data.topic_title,
        // "topic_description":  data.topic_description,
        // "topic_instructor": selectedOptionTeacher?.value,
        // "topic_group_student":[selectedOptionStudent1?.value,selectedOptionStudent2?.value,selectedOptionStudent3?.value].filter((item) => item !== null && item.length > 0)
      }


      const result: any = await StudentAPI.updateProfile(newData);

      if (result?.statusCode === 200) {
        Notify(result?.message)
        localStorage.setItem("user", JSON.stringify(result?.data?.user));

      }
      else {
        Notify("Cập nhật thông tin thật bại")
      }

    } catch (error: any) {
      Notify("Cập nhật thông tin thật bại")
    }
  }

  const onFileChangeDefenseRequest = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = () => {
        setScoreUpload(file)
      }
      reader.readAsDataURL(file);
    }
  }

  const handleUploadadDefenseRequest = async () => {
    let formData = new FormData();
    formData.append('user_file', scoreUpload);
    formData.append('update_field', 'user_transcript')

    await axios.post(`${BASE_API_URL}/users/student/uploadFile`, formData, { headers })
      .then(result => {

        console.log("Result:" + JSON.stringify(result))
        Notify("Upload bảng điểm thành công !");
      }).catch(err => {
        Notify("Upload bảng điểm thất bại!");
      })

  }

  const fetchProfile = useCallback(async () => {
    return await StudentAPI.getProfile(currentUser?._id);
  }, [])
  useEffect(() => {
    fetchProfile().then(async (result: any) => {
      if (result?.statusCode === 200) {
        await setUser(result?.data?.user)
        setScoreUpload({
          name: result?.data?.user?.user_transcript.split('/')[1]
        })
        setLoading(false)
      }
      else {
        Notify("Lỗi server đang bảo trì . Bạn vui lòng quay trở lại sau.");
        setLoading(false)
      }
    })
      .catch((err: any) => {
        Notify("Lỗi server đang bảo trì . Bạn vui lòng quay trở lại sau.");
        setLoading(false)
      })

  }, [])

  if (loading) {
    return (
      <Loading />
    )
  }

  return (
    <div className={styles.editProfile}>
      <div className={styles.personProfile}>

        <div className={styles.images}>
          <div className={styles.img}>
            <Image image={currentUser.user_avatar !== '' ? `${BASE_API_URL}/${currentUser?.user_avatar}` : `/public/avatar.jpg`} />
          </div>
          <div className={styles.iconPhoto} onClick={() => setVisible(true)}>
            <i className="fa fa-camera"></i>
          </div>
        </div>

        <Dialog
          header="Thay đổi ảnh đại diện"
          visible={visible}
          onHide={() => setVisible(false)}
          style={{ width: '30rem', height: '30rems' }}
          className='custom-dialog'
        >

          <div className="modal-changeAvatar">
            <div className="author-changeAvatar">
              <div className="profile-author-change">
                <img
                  className="avatar"
                  alt="author"
                  style={{ background: "#ffffff" }}
                  src={onChangeAvatar && imagesAvatar.length > 0
                    ? URL.createObjectURL(imagesAvatar[0])
                    :
                    (
                      currentUser.user_avatar !== ''
                        ?
                        `${BASE_API_URL}/${currentUser?.user_avatar}`
                        :
                        `/public/avatar.jpg`
                    )
                  }
                />

                <div className="edit-dp">
                  <label className="fileContainer">
                    <i className="fa fa-camera"></i>
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

        <div className={styles.name}>
          <p className={styles.content}>{user?.user_name}</p>
        </div>
        <div className={styles.nameInfo}>
          <p className={styles.content}><span className={styles.key}>MSSV</span> <span className={styles.value}>{`${user !== null ? user?.user_id : ""}`}</span></p>
        </div>
        <div className={styles.nameInfo}>
          <p className={styles.content}><span className={styles.key}>Email</span> <span className={styles.value}>{`${user !== null ? user?.email : ""}`}</span></p>
        </div>
        <div className={styles.nameInfo}>
          <p className={styles.content}><span className={styles.key}>SĐT</span> <span className={styles.value}>{`${user !== null ? user?.user_phone : ""}`}</span></p>
        </div>

        <div className={styles.parent}>

          <div className={styles.itemComponent}>
            <p className={styles.documentName}>Bảng điểm </p>
            {
              (user?.user_transcript || scoreUpload?.name) ?
                <a className={styles.fileName}
                  href={`${BASE_API_URL}/${user?.user_transcript} `}
                  target="_blank"
                >
                  {scoreUpload?.name}
                </a>
                :
                <p className={styles.fileName}>Không có tệp nào.</p>
            }


            <div className={styles.chooseFile}>
              <label className={styles.fileScore} htmlFor="file">Chọn file</label>
              <input id="file" type="file" onChange={onFileChangeDefenseRequest} />
              <button className={styles.btnUpload} onClick={handleUploadadDefenseRequest}>Tải lên</button>
            </div>

          </div>
        </div>


      </div>

      <div className={styles.baseProfile}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.baseProfileHead}>
            <h6 className={styles.title}>Thiết lập tài khoản</h6>
          </div>
          <div className={styles.mainForm}>

            <div className={styles.row}>
              <div className={styles.item}>
                <p className={styles.label}>Họ và tên</p>
                <input type="text" className={styles.input}{...register("user_name")} defaultValue={`${user !== null ? user?.user_name : ""}`} />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>Email</p>
                <input type="text" className={styles.input}{...register("email")} defaultValue={`${user !== null ? user?.email : ""}`} />
              </div>

            </div>
            <div className={styles.row}>
              <div className={styles.item}>
                <p className={styles.label}>MSSV</p>
                <input disabled type="text" className={styles.input} {...register("user_id")} defaultValue={`${user !== null ? user?.user_id : ""}`} />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>Căn cước công dân</p>
                <input type="text" className={styles.input} {...register("user_CCCD")} defaultValue={`${user !== null ? user?.user_CCCD : ""}`} />
              </div>

            </div>
            <div className={styles.row}>
              <div className={styles.item}>
                <p className={styles.label}>Địa chỉ thường trú</p>
                <input type="text" className={styles.input} {...register("user_permanent_address")} defaultValue={`${user !== null ? user?.user_permanent_address : ""}`} />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>Địa chỉ tạm trú</p>
                <input type="text" className={styles.input} {...register("user_temporary_address")} defaultValue={`${user !== null ? user?.user_temporary_address : ""}`} />
              </div>

            </div>
            <div className={styles.row}>
              <div className={styles.item}>
                <p className={styles.label}>Số điện thoại</p>
                <input type="text" className={styles.input} {...register("user_phone")} defaultValue={`${user !== null ? user?.user_phone : ""}`} />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>Điểm trung bình</p>
                <input type="number" className={styles.input}  {...register("user_average_grade")} defaultValue={`${user !== null ? user?.user_average_grade : ""}`} />
              </div>
            </div>
            <div className={styles.row}>
              <div className={styles.item}>
                <p className={styles.label}>Khoa </p>
                <input disabled type="text" className={styles.input} defaultValue={`${user !== null ? user?.user_faculty?.faculty_title : ""}`}  {...register("user_faculty")} />
              </div>
              <div className={styles.item}>
                <p className={styles.label}>Chuyên ngành</p>
                <input disabled type="text" className={styles.input} defaultValue={`${user !== null ? user?.user_major?.major_title : ""}`}  {...register("user_major")} />
              </div>
            </div>
            <div className={`${styles.row}`}>
              <div className={styles.item}>
              </div>
              <div className={styles.item}>
                <div className={styles.btnUpdate}>
                  <button className={styles.btnUpdateProfile}>Cập nhật</button>
                </div>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}

export default EditProfile
