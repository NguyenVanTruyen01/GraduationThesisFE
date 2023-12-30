import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net/users/student'

const StudentAPI = {
  //tất cả đề tài 
  getAllStudent: async () => {
    return await Repository('POST', url + '/search', { params: {}, body: { "role": "STUDENT" } });
  },
  getProfile: async (id: string) => {
    return await Repository('GET', url + `/findById/${id}`, { params: {}, body: { "role": "STUDENT" } });
  },
  updateProfile: async (data: any) => {
    return await Repository('PATCH', url + `/updateProfileInformation`, { params: {}, body: data });
  },
}

export default StudentAPI;
