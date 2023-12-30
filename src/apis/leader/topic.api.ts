import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}/topics/leader`

const TopicStudentAPI = {
   /**
   * @description Tạo mới topic
   */
   leaderCreateTopic: async (data: any) => {
    return await Repository('POST', `${url}/createTopic`, { params: {}, body: data });
  },

  /**
   * @description Lấy topic của giảng viên
   */
  leaderGetOwnTopics: async (data: any) => {
    return await Repository('POST', `${url}/getTopicOfTeacher`, { params: {}, body: data });
  },

  /**
   * @description Xóa nhóm sinh viên khỏi topic
   */
  leaderRemoveGroupFromTopic: async (data: any) => {
    return await Repository('POST', `${url}/removeGroupFromTopic`, { params: {}, body: data });
  },

  /**
   * @description Phê duyệt nhóm sinh viên thực hiện đề tài
   */
  leaderApproveGroupStudent: async (data: any) => {
    return await Repository('POST', `${url}/approveGroupStudent`, { params: {}, body: data });
  },

  /**
   * @description Lấy topics theo bộ lọc
   */
  leaderGetTopicsByFilter: async (data: any) => {
    return await Repository('POST', `${url}/getTopicByFilter`, { params: {}, body: data });
  },


  /**
   * @description Lấy topic của chính giảng viên
   */
  leaderGetAllTopics: async () => {
    return await Repository('GET', `${url}/getAll`, { params: {}, body: {} });
  },

  /**
   * @description Lấy một topic
   */
  leaderGetTopicsReview: async () => {
    return await Repository('GET', `${url}/getTopicsReview`, { params: {}, body: {} });
  },

  /**
   * @description Lấy một topic
   */
  leaderGetOneTopic: async (id: string) => {
    return await Repository('GET', `${url}/findById/${id}`, { params: {}, body: {} });
  },

  /**
  * @description Cập nhật topic
  */
  leaderUpdateTopic: async (id: string, data: any) => {
    return await Repository('PATCH', `${url}/updateById/${id}`, { params: {}, body: data });
  },

  /**
   * @description Xóa topic
   */
  leaderDeleteTopic: async (id: string) => {
    return await Repository('DELETE', `${url}/deleteById/${id}`, { params: {}, body: {} });
  },
}

export default TopicStudentAPI;
