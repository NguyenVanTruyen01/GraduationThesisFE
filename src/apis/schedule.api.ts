import Repository from "../hooks/useRepositoryConfig"

const url='https://graduation-thesis-be.onrender.com/schedule'


const ScheduleAPI= {

    //tất cả nhóm 
    getScheduleByIDTeacher: async () => {
        return await Repository('GET', url + '/', { params: {}, body: {} });
    },

 

}

export default ScheduleAPI;

