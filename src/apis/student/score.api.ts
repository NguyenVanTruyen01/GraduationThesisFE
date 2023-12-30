import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net'


const ScoreAPI = {

    //tất cả đề tài 
    getScore: async (data: any) => {
        return await Repository('POST', url + '/scoreboard/student/getByFilter', { params: {}, body: data });
    },


}

export default ScoreAPI;

