import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net/topics/student'

const TopicStudentAPI = {
  //tất cả đề tài 
  getAllTopicTeacher: async () => {
    return await Repository('GET', url + '/getAll', { params: {}, body: {} });
  },
  suggestTopic: async (data: any) => {
    return await Repository('POST', url + '/createTopic', { params: {}, body: data });
  },
  registerTopic: async (data: any) => {
    return await Repository('POST', url + '/registerTopic', { params: {}, body: data });
  },
  fetchMyTopic: async () => {
    return await Repository('GET', url + '/getMyRegisteredTopics', { params: {}, body: {} });
  },
  fetchDetailTopic: async (id: any) => {
    return await Repository('GET', url + `/findById/${id}`, { params: {}, body: {} });
  },
  uploadScoreStudent: async (data: any) => {
    return await Repository('POST', url + `/uploadFile`, { params: {}, body: data });
  },
  cancelTopic: async (data: any) => {
    return await Repository('POST', url + `/cancelProjectRegistration`, { params: {}, body: data });
  },
  deleteSuggestTopic: async (data: any) => {
    return await Repository('DELETE', url + `/deleteById/${data}`, { params: {}, body: {} });
  },
}

export default TopicStudentAPI;
