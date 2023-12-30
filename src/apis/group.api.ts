import Repository from "../hooks/useRepositoryConfig"

const url='https://graduation-thesis-be.onrender.com/groups'


const GroupAPI= {

    //tất cả nhóm 
    getAllGroup: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    //xem chi tiết thông tin nhóm
    getGroupByID: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    //thêm thành viên vào nhóm ( Giangr viên và sinh viên)
    addMemberGroup: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    //Trường hợp sinh viên gặp sự cố không muốn làm chung nữa cần xoá 
    deleteMemberGroup: async () => {
        return await Repository('DELETE', url + '/', { params: {}, body: {} });
    },

    // nhóm mà giảng viên hướng dẫn
    getGroupByTeacherID: async () => { 
        return await Repository('GET', url + '/', { params: {}, payload: {} });
    },

    // thành lập nhóm với giảng viên
    createGroupByTeacher: async (data:any) => {
        return await Repository('POST', url + '/', { params: {}, body: data });
    },

    // thành lập nhóm bởi sinh viên
    createGroupByStudent: async (data:any) => {
        return await Repository('POST', url + '/', { params: {}, body: data });
    },

}

export default GroupAPI;

