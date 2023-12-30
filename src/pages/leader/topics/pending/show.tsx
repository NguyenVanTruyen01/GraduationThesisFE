import Field from "@/components/field/Field";
import Input from "@/components/input/Input";
import Label from "@/components/label/Label";
import Loading from "@/components/loading/Loading";
import { getToken } from "@/hooks/useGetToken";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

interface ITopicPendingDetailProps {
}

const LeaderTopicPendingShow: React.FC<ITopicPendingDetailProps> = (props) => {
  const navigate = useNavigate()
  const { topicID } = useParams()

  console.log(topicID);

  const [topicDetail, setTopicDetail] = useState<any>({})
  const [groupStudents, setGroupStudents] = useState([]);
  const [loading, setLoading] = useState(true)

  const { control } = useForm({
    mode: "onChange",
    defaultValues: {
      topic_title: "",
      topic_description: "",
      topic_max_members: 0,
      topic_group_student: []
    },
  })

  const headers = getToken('token')

  let groupStudentId: any[] = []

  async function fetchData() {
    await axios.get(`${BASE_API_URL}/topics/leader/findById/${topicID}`, { headers })
      .then(async (response) => {
        console.log(response);
        await setTopicDetail(response.data.data.topic)
        groupStudentId = response.data.data.topic.topic_group_student
      })
      .then(async (response) => {
        if (groupStudentId.length > 0) {
          const res = await axios.post(`${BASE_API_URL}/group-student/teacher/getManyGroupStudent`, {
            group_student_ids: groupStudentId
          }, { headers })
          console.log(res);
          if (res.data.statusCode === 200) {
            setGroupStudents(res.data.data.group_students)
            setLoading(false)
          }
        }
        else {
          setLoading(false)
        }

      })
  }

  useEffect(() => {
    fetchData()
  }, []);

  const handleRemoveGroup = async (groupId: number) => {
    const response = await axios.post(`${BASE_API_URL}/topics/teacher/removeGroupFromTopic`, {
      topic_id: topicID,
      group_student_id: groupId
    }, { headers })
    if (response.data.statusCode === 200) {
      toast.success(response.data.data.message)
      window.location.reload()
    }
    else {
      toast.error("Có lỗi xảy ra, vui lòng thử lại")
    }
  }

  const handleSubmitTopics = async (topicID: any) => {
    console.log("===>>>");
    const response = await axios.patch(`${BASE_API_URL}/topics/leader/updateById/${topicID}`, {
      topic_leader_status: "ACTIVE"
    }, { headers })
    console.log('response', response);
    console.log(response.data.data.message);
    if (response.data.statusCode === 200) {
      toast.success(response.data.message)

    }
    else {
      toast.error(response.data.message)
    }
  }

  if (loading) {
    return (
      <Loading />
    )
  }
  return (
    <Fragment>
      <div className="form-layout">
        <Field>
          <Label>Tên đề tài</Label>
          <Input control={control} name="topic_title" value={topicDetail.topic_title} />
        </Field>
        <Field>
          <Label>Mô tả đề tài</Label>
          <Input control={control} name="topic_description" value={topicDetail.topic_description} />
        </Field>
      </div>
      <div className="form-layout">
        <Field>
          <Label>Số lượng thực hiện</Label>
          <Input control={control} name="topic_max_members" value={topicDetail.topic_max_members} />
        </Field>
        <Field>
          <Label>Giảng viên phản biện</Label>
          <Input control={control} name="topic_reviewer" value={`${topicDetail.topic_reviewer === null ? "Trống" : topicDetail.topic_reviewer}`} />
        </Field>
      </div>
      <div className="relative mt-10 overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                STT
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Tên nhóm
                  <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg></a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Số lượng thành viên
                  <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg></a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Thành viên
                  <a href="#"><svg className="w-3 h-3 ml-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
                  </svg></a>
                </div>
              </th>
              <th scope="col" className="px-6 py-3">
                <div className="flex items-center">
                  Hành động
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {groupStudents.length > 0 && groupStudents.map((group: any, index) => {
              return (
                <tr key={index} className="bg-white border-b" >
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {index + 1}
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    Nhóm {index + 1}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {group.group_member.length}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {
                      group.group_member?.map((member: any, index: number) => {
                        return (
                          <div key={index}>
                            {member.user_name}
                          </div>
                        )
                      })
                    }
                  </td>
                  <td className="flex items-center justify-around px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    <i className="cursor-pointer fa-solid fa-trash-can " onClick={() => {
                      handleRemoveGroup(group._id)
                    }} />
                    <i className="cursor-pointer fa-solid fa-eye" onClick={() => {
                      navigate(`//leader/topics/mentor/groups/${group._id}`)
                    }} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="flex justify-around mt-10">
        <button className="px-8 py-5 font-bold text-black border rounded-xl border-primary bg-primary hover:bg-opacity-50">Hủy bỏ</button>
        <button className="px-8 py-5 font-bold text-black border rounded-xl border-primary bg-primary hover:bg-opacity-50" type="submit" onClick={() => { handleSubmitTopics(topicID) }}>Xác nhận</button>
      </div>
    </Fragment>
  );
};

export default LeaderTopicPendingShow;
