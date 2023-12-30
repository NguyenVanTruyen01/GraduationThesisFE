import Repository from "../hooks/useRepositoryConfig"

const url='https://graduation-thesis-be.onrender.com/reports'


const ReportAPI= {

    //tất cả nhóm 
    getAllReport: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    //xem chi tiết thông tin báo cáo của nhóm 
    getGroupByGroupID: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    //Nhóm tạo report hàng tuần
    createReport: async (data:any) => {
        return await Repository('GET', url + '/', { params: {}, body: data });
    },

    //Giaó viên nhận xét báo cáo của giảng viên hàng tuần
    updateCommentReport: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },
}

export default ReportAPI;

