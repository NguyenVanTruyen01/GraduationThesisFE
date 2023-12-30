import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}/topics/teacher`


const TopicTeacherApi = {
  /**
   * @description Tạo mới topic
   */
  teacherCreateTopic: async (data: any) => {
    return await Repository('POST', `${url}/createTopic`, { params: {}, body: data });
  },

  /**
   * @description Lấy topic của giảng viên
   */
  teacherGetOwnTopics: async (data: any) => {
    return await Repository('POST', `${url}/getTopicOfTeacher`, { params: {}, body: data });
  },

  /**
   * @description Xóa nhóm sinh viên khỏi topic
   */
  teacherRemoveGroupFromTopic: async (data: any) => {
    return await Repository('POST', `${url}/removeGroupFromTopic`, { params: {}, body: data });
  },

  /**
   * @description Phê duyệt nhóm sinh viên thực hiện đề tài
   */
  teacherApproveGroupStudent: async (data: any) => {
    return await Repository('POST', `${url}/approveGroupStudent`, { params: {}, body: data });
  },

  /**
   * @description Lấy topics theo bộ lọc
   */
  teacherGetTopicsByFilter: async (data: any) => {
    return await Repository('POST', `${url}/getTopicByFilter`, { params: {}, body: data });
  },


  /**
   * @description Lấy topic của chính giảng viên
   */
  teacherGetAllTopics: async () => {
    return await Repository('GET', `${url}/getAll`, { params: {}, body: {} });
  },

  /**
   * @description Lấy một topic
   */
  teacherGetTopicsReview: async () => {
    return await Repository('GET', `${url}/getTopicsReview`, { params: {}, body: {} });
  },

  /**
   * @description Lấy một topic
   */
  teacherGetOneTopic: async (id: any) => {
    return await Repository('GET', `${url}/findById/${id}`, { params: {}, body: {} });
  },

  /**
  * @description Cập nhật topic
  */
  teacherUpdateTopic: async (id: string, data: any) => {
    return await Repository('PATCH', `${url}/updateById/${id}`, { params: {}, body: data });
  },

  /**
   * @description Xóa topic
   */
  teacherDeleteTopic: async (id: string) => {
    return await Repository('DELETE', `${url}/deleteById/${id}`, { params: {}, body: {} });
  },
}

export default TopicTeacherApi;
