import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net'


const PeriodAPI = {

    //tất cả đề tài 
    getPeriod: async () => {
        return await Repository('GET', url + '/registration_period/student/getCurrentRegistrationPeriod', { params: {}, body: {} });
    },


}

export default PeriodAPI;

