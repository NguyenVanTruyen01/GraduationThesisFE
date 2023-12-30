import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url=`${BASE_API_URL}`


const MajorAPI = {

    // Tất cả chuyên ngành
    getAllMajor: async () => {
        return await Repository('GET', url + '/major', { params: {}, body: {} });
    },


}

export default MajorAPI;

