import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net/users/student'


const TeacherAPI = {

    //tất cả đề tài 
    getAllTeacher: async () => {
        return await Repository('POST', url + '/search', { params: {}, body: { "role": "TEACHER" } });
    },

}

export default TeacherAPI;
