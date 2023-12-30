import Repository from "../hooks/useRepositoryConfig"

const url='https://graduation-thesis-be.onrender.com/topics'


const AssemblyAPI= {

    //tất cả hội đồng phản biện
    getAllAssembly: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // xem chi tiết hội đồng phản biện
    getAssemblyByID: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // Tới ngày phản biện trưởng ngành sắp xếp giáo viên vào phản biện từng nhóm
    updateAssemblyByID: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // thành lập hội đồng phản biện
    createAssembly: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

    // Huỷ hội đồng phản biện
    deleteAssemblyByID: async (data:any) => {
        return await Repository('POST', url + '/', { params: {}, body: data });
    },

}

export default AssemblyAPI;

