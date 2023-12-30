import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}/topics/teacher`
const AssemblyTeacherAPI = {

  getAllTopicTeacherAssembly: async (data: any) => {
    return await Repository('GET', url + `/getTopicsAssembly`, { params: {}, body: data.data });
  },
}

export default AssemblyTeacherAPI;
