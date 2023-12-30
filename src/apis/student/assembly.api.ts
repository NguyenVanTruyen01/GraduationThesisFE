import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";
const url=`${BASE_API_URL}`

const AssemblyAPI= {

    //tất cả đề tài 
    getAssembly: async (id:string) => {
        return await Repository('GET', url + '/assembly/findById/'+id, { params: {}, body: {} });
    },
 

}

export default AssemblyAPI;

