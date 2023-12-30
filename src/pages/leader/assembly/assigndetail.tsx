import Field from "@/components/field/Field";
import Label from "@/components/label/Label";
import { getToken } from "@/hooks/useGetToken";
import { ITopic } from "@/types/interface";
import { BASE_API_URL } from "@/utils/globalVariables";
import axios from "axios";
import moment from "moment";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useState } from 'react';
import toast from "react-hot-toast";

type ILeaderAssignDetailAssemblyProps = {
  topics: ITopic[]
  assemblyId: string | undefined
}

const LeaderAssignDetailAssembly: React.FC<ILeaderAssignDetailAssemblyProps> = ({ topics, assemblyId }) => {
  const headers = getToken("token")
  const [topicDetails, setTopicDetails] = useState<Array<any>>([])

  const handleInputChange = (index: number, field: string, value: string) => {
    setTopicDetails(prevDetails => {
      const updatedDetails = [...prevDetails];
      if (!updatedDetails[index]) {
        updatedDetails[index] = { topic_id: topics[index]._id }; // Initialize if not exists
      }
      if (field === 'topic_date') {
        const formattedDate = moment(value).format("DD/MM/YYYY")
        console.log("formattedDate", formattedDate);
        updatedDetails[index][field] = formattedDate;
      } else {
        updatedDetails[index][field] = value;
      }
      return updatedDetails;
    });
  };

  const saveDetails = async () => {
    const errorMessages = [];
    const currentDate = moment();

    for (let i = 0; i < topicDetails.length; i++) {
      const currentDetail = topicDetails[i];

      // Kiểm tra nếu có topic_date giống nhau
      const duplicateDateDetails = topicDetails.filter(
        (detail, index) => detail.topic_date === currentDetail.topic_date && index !== i
      );

      if (duplicateDateDetails.length > 0) {
        // Nếu có topic_date giống nhau, kiểm tra topic_room và thời gian
        const conflictingDetails = duplicateDateDetails.filter(
          (detail) =>
            detail.topic_room === currentDetail.topic_room &&
            ((moment(currentDetail.topic_time_start, 'HH:mm').isBetween(
              moment(detail.topic_time_start, 'HH:mm'),
              moment(detail.topic_time_end, 'HH:mm')
            ) ||
              moment(currentDetail.topic_time_end, 'HH:mm').isBetween(
                moment(detail.topic_time_start, 'HH:mm'),
                moment(detail.topic_time_end, 'HH:mm')
              )) ||
              (moment(detail.topic_time_start, 'HH:mm').isBetween(
                moment(currentDetail.topic_time_start, 'HH:mm'),
                moment(currentDetail.topic_time_end, 'HH:mm')
              ) ||
                moment(detail.topic_time_end, 'HH:mm').isBetween(
                  moment(currentDetail.topic_time_start, 'HH:mm'),
                  moment(currentDetail.topic_time_end, 'HH:mm')
                )))
        );

        if (conflictingDetails.length > 0) {
          // Nếu có xung đột thời gian, thêm thông báo lỗi
          errorMessages.push(
            `Topic ${i + 1} conflicts with Topic ${topics.indexOf(conflictingDetails[0]) + 1}`
          );
        }
      }

      // Kiểm tra nếu topic_date nhỏ hơn ngày hiện tại
      if (moment(currentDetail.topic_date, 'DD/MM/YYYY').isBefore(currentDate, 'day')) {
        errorMessages.push(`Topic ${i + 1} has a date earlier than the current date.`);
      }
    }
    // In ra các thông báo lỗi hoặc thực hiện hành động khác dựa trên kết quả
    if (errorMessages.length > 0) {
      toast.error("Dữ liệu không thỏa mãn")
      console.error('Error Messages:', errorMessages);
      // Thực hiện hành động khi có lỗi, ví dụ: hiển thị thông báo cho người dùng
    } else {
      const updatedTopicDetails = topicDetails.map((detail) => {
        return { ...detail, topic_assembly: assemblyId };
      });
      setTopicDetails(updatedTopicDetails);
      // Thực hiện hành động khi không có lỗi, ví dụ: lưu thông tin vào cơ sở dữ liệu
      try {
        const response = await axios.post(`${BASE_API_URL}/topics/leader/updateInfoAssembly`, {
          "data": updatedTopicDetails
        }, { headers })
        if (response.data.statusCode == 200) {
          toast.success("Cập nhật thông tin thành công")
        } else {
          toast.error("Cập nhật thông tin không thành công")
        }
      } catch (error: any) {
        toast.error(error.response.data.message)
      }
    }
  };

  return (
    <section className="">
      <div className="mt-4">
        {topics && topics.map((topic, index) => (
          <div className="flex gap-x-3 items-center p-4 rounded-xl border border-borderColor mb-4" key={index}>
            <div className="flex flex-col w-[40%]">
              <span><strong>Tên đề tài:</strong> {topic.topic_title}</span>
              <span><strong>GVHD:</strong>  {topic.topic_instructor?.user_name}</span>
              <span><strong>GVPB:</strong>  {topic.topic_reviewer?.user_name}</span>
            </div>
            <div className="flex gap-x-3">
              <Field>
                <Label htmlFor="topic_registration_period">Phòng báo cáo</Label>
                <InputText
                  placeholder="Nhập phòng"
                  onChange={(e) => handleInputChange(index, 'topic_room', e.target.value)}
                />
              </Field>
              <Field>
                <Label htmlFor="topic_registration_period">Ngày báo cáo</Label>
                <InputText type="date" onChange={(e) => handleInputChange(index, 'topic_date', e.target.value)} />
              </Field>
              <Field>
                <Label htmlFor="topic_registration_period">Bắt đầu</Label>
                <InputText type="time" onChange={(e) => handleInputChange(index, 'topic_time_start', e.target.value)} />
              </Field>
              <Field>
                <Label htmlFor="topic_registration_period">Kết thúc</Label>
                <InputText type="time" onChange={(e) => handleInputChange(index, 'topic_time_end', e.target.value)} />
              </Field>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center mt-4">
        <Button onClick={saveDetails} label="Xác nhận" icon="pi pi-check-circle"/>
      </div>
    </section>
  );
};

export default LeaderAssignDetailAssembly;
