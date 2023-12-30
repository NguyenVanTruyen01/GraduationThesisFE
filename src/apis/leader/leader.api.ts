import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}/users/leader`

const LeaderAPI = {


    getProfile: async (id: string) => {
        return await Repository('GET', url + `/findById/${id}`, { params: {}, body: { "role": "LEADER" } });
    },

    updateProfile: async (data: any) => {
        return await Repository('PATCH', url + `/updateProfileInformation`, { params: {}, body: data });
    },

}

export default LeaderAPI;
