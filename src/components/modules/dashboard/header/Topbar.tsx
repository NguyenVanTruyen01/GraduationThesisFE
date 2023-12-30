import "./Topbar.scss"
import UserMenu from "@/components/navbar/UserMenu"
import { useCallback, useLayoutEffect, useRef, useState } from "react"
import NotificationAPI from "@/apis/student/notification.api"
import Notify from "@/utils/Toast"
import { convertDateTime } from "@/utils/ConvertDate"
import { Dialog } from "primereact/dialog"
import { Button } from "primereact/button"
import moment from "moment"
import axios from "axios"
import { BASE_API_URL } from "@/utils/globalVariables"
import { getToken } from "@/hooks/useGetToken"
import toast from "react-hot-toast"
import { INotification } from "@/types/interface"
import { Tooltip } from "primereact/tooltip"
import { Badge } from "primereact/badge"
import { useClickOutside } from 'primereact/hooks'
type Props = {}

const Topbar = (props: Props) => {
  let [listNotification, setListNotification] = useState<any>([]);
  let [unRead, setUnRead] = useState<number>(0);
  let [detailNotification, setDetailNotification] = useState<INotification>();
  let [openDetailNotification, setOpenDetailNotification] = useState<boolean>(false);
  let [visible, setVisible] = useState<boolean>(false);

  const overlayRef = useRef(null);

  useClickOutside(overlayRef, () => {
    setVisible(false);
  });

  let handlePopupDetailNotification = (item: INotification) => {
    setDetailNotification(item)
    setOpenDetailNotification(!openDetailNotification)
  }

  const handleSeenNotification = async (detail: any) => {
    const { _id } = detail
    const headers = getToken('token')
    try {
      const response = await axios.patch(`${BASE_API_URL}/user_notification/updateById/${_id}`, {
        user_notification_isRead: true
      }, { headers })
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setOpenDetailNotification(false)
        setVisible(false)
        window.location.reload()
      }
    } catch (error) {

    }
  }

  const handleDeleteNotification = async (detail: any) => {
    const { _id } = detail
    const headers = getToken('token')
    try {
      const response = await axios.delete(`${BASE_API_URL}/user_notification/deleteById/${_id}`, { headers })
      console.log(response);
      if (response.data.statusCode === 200) {
        toast.success(response.data.message)
        setOpenDetailNotification(false)
        setVisible(false)
        window.location.reload()
      }
    } catch (error) {

    }
  }

  let fetchAllNotification = useCallback(async () => {
    return await NotificationAPI.getAllNotificationStudent();
  }, [])

  useLayoutEffect(() => {
    fetchAllNotification().then((result: any) => {
      if (result?.statusCode === 200) {
        setListNotification(result?.data?.user_notifications)
        setUnRead(result?.data?.total_unread);
      }
      else {
        Notify(result?.message);
      }
    })
      .catch((err: any) => {
        Notify("Server đang được nâng cấp tính năng thông báo . Bạn vui lòng quay trở lại sau.");
      })
  }, [])

  const footerContent = (
    <div className="">
      <Button size="small" label="Xóa" icon="pi pi-trash" onClick={() => handleDeleteNotification(detailNotification)} />
      <Button size="small" disabled={detailNotification?.user_notification_isRead === true} label="Đã xem" icon="pi pi-eye" onClick={() => handleSeenNotification(detailNotification)} autoFocus />
    </div>
  );

  return (
    <div className="mainHeader relative select-none ">
      <div className="top">
        <i className="fa-solid fa-bars" />
        <div className="flex items-center justify-center z-[1000] hover:cursor-pointer gap-x-3" >
          <div className="flex justify-center">
            <Tooltip target=".custom-target-icon" />
            <i className="custom-target-icon pi pi-bell p-text-secondary p-overlay-badge"
              data-pr-tooltip={`${unRead > 0 ? "Bạn có thông báo chưa đọc" : "Không có thông báo mới"}`}
              data-pr-position="right"
              data-pr-at="right+5 top"
              data-pr-my="left center-2"
              style={{ fontSize: '1rem', cursor: 'pointer' }}
              onClick={() => setVisible(true)}
            >
              {unRead > 0 && <Badge severity="danger" value={unRead} size="normal">{unRead}</Badge>}
            </i>
          </div>
          <UserMenu />
        </div>
      </div>
      {
        visible ? (
          <div ref={overlayRef} style={{ width: "400px" }} className={`notificationList ${unRead <= 0 && listNotification.length <= 0 ? "px-4" : ""} rounded-lg absolute z-[1000] top-7 right-[25%] bg-panelColor max-h-[500px] min-h-[50px] overflow-x-scroll shadow-inner`}>
            <ul className="notifications">
              {
                listNotification?.length > 0 ? listNotification.map((value: INotification, index: number) => {
                  return (
                    <li className="border-b border-borderColor hover:cursor-pointer hover:bg-bgColor py-4 px-5" key={`item-notification-${index}`} onClick={() => handlePopupDetailNotification(value)}>
                      <p className="font-medium text-sm pb-2">{value?.user_notification_title}</p>
                      <div className="w-full flex justify-between text-xs">
                        <span className="mainContent">{value?.user_notification_content?.length > 25 ? value?.user_notification_content.slice(0, 25) + "..." : value?.user_notification_content}</span>
                        <span className="mainTime">{convertDateTime(value?.createdAt)}</span>
                      </div>
                      <p className="text-xs mt-2 font-bold">{value?.user_notification_isRead ? <span className="text-green-700">Đã xem</span> : <span className="text-error">Chưa xem</span>}</p>
                    </li>
                  )
                }) : <span className="text-sm text-center">Bạn chưa có thông báo nào</span>
              }
            </ul>
          </div>
        ) : null
      }

      <Dialog className="text-sm" header="Chi tiết thông báo" visible={openDetailNotification} style={{ width: '50vw' }} onHide={() => setOpenDetailNotification(false)} footer={footerContent}>
        <div className="flex flex-col justify-center">
          <p className="font-bold text-sm">Thông báo</p>
          <p>{detailNotification?.user_notification_title}</p>
          <p className="font-bold text-sm mt-3">Nội dung</p>
          <p>{detailNotification?.user_notification_content}</p>
          <p className="font-bold text-sm mt-3">Thời gian</p>
          <p>{moment(detailNotification?.createdAt).format('DD/MM/YYYY, h:mm:ss a')}</p>
        </div>
      </Dialog>
    </div>
  )
}

export default Topbar
