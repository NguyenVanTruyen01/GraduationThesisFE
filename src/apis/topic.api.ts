import Repository from "../hooks/useRepositoryConfig"

const url='https://graduation-thesis-be.onrender.com/topics'


const TopicAPI= {

    //tất cả đề tài 
    getAllTopic: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // đề tài của 1 giáo viên hướng dẫn 
    getTopicByTeacher: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

     // Xem chi tiết 1 đề tài
    getTopicByIDTopic: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // Chỉnh sửa đề tài (Giảng viên ) . Sửa trước khi đước duyệt
    updateTopicByIDTopic: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // giảng viên tạo đề tài hướng dẫn của bản thân 
    createTopicByTeacher: async (data:any) => {
        return await Repository('POST', url + '/', { params: {}, body: data });
    },

    // trưởng ngành duyệt đề tài của giảng viên đưa lên 
    acceptTopicByLeader: async (data:any) => {
        return await Repository('POST', url + '/', { params: {}, body: data });
    },

    // giảng viên xoá đề tài  (chỉ xoá đề tài chưa được trưởng ngành duyệt)
    deleteTopicByTeacher: async (data:any) => {
        return await Repository('DELETE', url + '/', { params: {}, body: data });
    },
}

export default TopicAPI;

