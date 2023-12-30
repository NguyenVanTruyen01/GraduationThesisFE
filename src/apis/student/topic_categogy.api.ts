import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net'


const TopicCategoryAPI = {

    // Tất cả chuyên ngành
    getAllTopicCategory: async () => {
        return await Repository('GET', url + '/topic_category/getAll', { params: {}, body: {} });
    },


}

export default TopicCategoryAPI;

