import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}/scoreboard`

const ScoreTeacherAPI = {

  updateScore: async (data: any) => {
    return await Repository('PATCH', url + `/updateById/${data.student_id}`, { params: {}, body: data.data });
  },
  //Lấy bảng điểm 
  getScore: async (data: any) => {
    return await Repository('POST', url + '/getByFilter', { params: {}, body: data });
  },
}

export default ScoreTeacherAPI;
