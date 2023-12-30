import { getToken } from "@/hooks/useGetToken"
import { BASE_API_URL } from "@/utils/globalVariables"
import axios from "axios"
import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import "./navbar.component.scss"

type Props = {}

const studentSidebar = [
  {
    title: "Trang chủ",
    url: "/student/home",
    icon: "fa-solid fa-house",
  },
  {
    title: "Đề tài",
    url: "/student/topic",
    icon: "fa-solid fa-folder",
  },
  {
    title: "Đề xuất",
    url: "/student/suggest",
    icon: "fa-regular fa-folder-open",
  }
]

const teacherSidebar = [
  {
    title: "Tổng quan",
    url: "/teacher/dashboard",
    icon: "fa-solid fa-house",
  },
  {
    title: 'Đề tài',
    icon: 'fa-solid fa-cog',
    submenu: [
      {
        title: "Sinh viên đề xuất",
        url: "/teacher/topics/proposed",
      },
      {
        title: "Quản lí đề tài",
        url: "/teacher/topics/pending",
        // icon: "fa-solid fa-folder",
      },
      {
        title: "Duyệt nhóm thực hiện",
        url: "/teacher/topics/ready",
        // icon: "fa-solid fa-folder",
      },
      {
        title: "Đề tài hướng dẫn",
        url: "/teacher/topics/mentor",
        // icon: "fa-regular fa-folder-open",
      },
      {
        title: "Đề tài phản biện",
        url: "/teacher/topics/review",
        // icon: "fa-regular fa-folder-open",
      },
    ],
  },
  {
    title: "Hội đồng",
    url: "/teacher/topics/assembly",
    icon: "fa-solid fa-people-line",
  },
  {
    title: "Lịch sử đề tài",
    url: "/teacher/history-topic",
    icon: "fa-solid fa-people-line",
  }
]

const leaderSidebar = [
  {
    title: "Tổng quan",
    url: "/leader/dashboard",
    icon: "pi pi-home",
  },
  {
    title: "Đề tài",
    icon: "pi pi-book",
    submenu: [
      {
        title: "Cần duyệt",
        url: "/leader/topics/pending",
      },
      {
        title: "Đang thực hiện",
        url: "/leader/topics/active",
      },
      {
        title: "Nghiên cứu",
        url: "/leader/topics/analysis",
      },
      {
        title: "Ứng dụng",
        url: "/leader/topics/application",
      }
    ],
  },
  {
    title: "Sinh viên",
    url: "/leader/students",
    icon: "pi pi-users",
  },
  {
    title: "Giảng viên",
    url: "/leader/teachers",
    icon: "pi pi-users",
  },
  {
    title: "Hội đồng",
    url: "/leader/assembly",
    icon: "pi pi-sitemap",
  },
  {
    title: 'Thiết lập',
    icon: 'pi pi-spin pi-cog',
    submenu: [
      {
        title: 'Học kỳ',
        url: '/leader/semesters',
      },
      {
        title: "Đợt đăng ký",
        url: "/leader/terms"
      },
      {
        title: "Phiếu đánh giá",
        url: "/leader/rubric",
      },
    ],
  },
  {
    title: "Lịch sử đề tài",
    url: "/leader/history-topic",
    icon: "pi pi-server",
  }
]

const NavbarDashboard = (props: Props) => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  let sidebarItems
  if (user?.role && user?.role === 'STUDENT') {
    sidebarItems = studentSidebar
  }
  if (user?.role && user?.role === 'TEACHER') {
    sidebarItems = teacherSidebar
  }
  if (user?.role && user?.role === 'LEADER') {
    sidebarItems = leaderSidebar
  }

  const [topicPending, setTopicPending] = useState(0);

  const headers = getToken('token')
  const filterData = {
    filter: {
      topic_leader_status: "PENDING"
    }
  }

  async function fetchData() {
    const response = await axios.post(`${BASE_API_URL}/topics/leader/getTopicByFilter`, filterData, { headers })
    if (response.data.statusCode === 200) {
      setTopicPending(response?.data?.data?.topics.length)
    }
  }

  useEffect(() => {
    if (user?.role && user?.role === 'LEADER') {
      fetchData()
    }
  }, [topicPending]);

  // Thêm state cho việc theo dõi trạng thái hiển thị của submenu
  const [submenuOpen, setSubmenuOpen] = useState<number | null>(null);

  return (
    <nav>
      <div className="flex items-center justify-center gap-x-3">
        {/* <div className="flex  max-w-[40px]"> */}
        <img className="w-[40px] object-cover rounded-full" src="/public/learning_plus.png" alt="" />
        {/* </div> */}
        <span className="font-bold italic text-xl text-whiteSoft">DDT THESIS</span>
      </div>

      <div className="mt-5 flex flex-col justify-between menu-items">
        <ul className="nav-links">
          {sidebarItems?.map((item: any, index) => {
            const isSubmenuOpen = submenuOpen === index;
            return (
              <li key={index}>
                {item.url ? (
                  <div
                    onClick={() => setSubmenuOpen(isSubmenuOpen ? null : index)}
                  >
                    <NavLink
                      className={({ isActive }) =>
                        isActive ? "active bg-slate-500" : ""
                      }
                      to={item.url}
                    >
                      <i className={`${item.icon} icon`} />
                      <span className="link-name">{item.title}</span>
                    </NavLink>
                  </div>
                ) : (
                  <div onClick={() => setSubmenuOpen(isSubmenuOpen ? null : index)}
                  >
                    <a>
                      <i className={`${item.icon} icon`} />
                      <span className="link-name">{item.title}</span>
                      {
                        item.title === 'Đề tài' && topicPending > 0 ? <div className="noti-topic-pending">{topicPending}</div> : <></>
                      }
                      {
                        isSubmenuOpen ?
                          <i className="fa-solid fa-angle-down icon-submenu animate-fade-in open" />
                          :
                          <i className="fa-solid fa-angle-right icon-submenu" />
                      }
                    </a>
                  </div>
                )}
                {item.submenu && isSubmenuOpen && (
                  <ul className={`submenu ${isSubmenuOpen ? 'open' : ''}`}>
                    {item.submenu.map((subItem: any, subIndex: any) => (
                      <li key={subIndex}>
                        <NavLink
                          className={({ isActive }) =>
                            isActive ? "active bg-slate-500" : ""
                          }
                          to={subItem.url}
                        >
                          <i className={`${subItem.icon} icon`} />
                          <span className="link-name">{subItem.title}</span>
                          {
                            subItem.title === 'Cần duyệt' && topicPending > 0 ? <div className="sub-topic-pending"></div> : <></>
                          }
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  )
}

export default NavbarDashboard