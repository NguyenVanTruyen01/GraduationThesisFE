import Repository from "@/hooks/useRepositoryConfig";
import { BASE_API_URL } from "@/utils/globalVariables";

const url = `${BASE_API_URL}`

const RegisterPeriodLeaderAPI = {
   /**
   * @description Tạo mới đợt đăng ký
   */
   leaderCreateRegisterPeriod: async (data: any) => {
    return await Repository('POST', `${url}/registration_period/leader/createRegistrationPeriod`, { params: {}, body: data });
  },

  /**
   * @description Lấy tất cả các đợt đăng ký
   */
  leaderGetAllRegisterPeriod: async (data: any) => {
    return await Repository('GET', `${url}/registration_period/leader/getAll`, { params: {}, body: data });
  },

  /**
   * @description Lấy đợt đăng ký đang mở hiện tại
   */
  leaderGetOpenRegisterPeriod: async () => {
    return await Repository('GET', `${url}/registration_period/leader/getCurrentRegistrationPeriod`, { params: {}, body: {} });
  },

  /**
   * @description Lấy ra một đợt đăng ký
   */
  leaderGetARegisterPeriod: async (id: string) => {
    return await Repository('GET', `${url}/registration_period/leader/findById/${id}`, { params: {}, body: {} });
  },

  /**
   * @description Cập nhật đợt đăng ký
   */
  leaderUpdateRegisterPeriod: async (id: string, data: any) => {
    return await Repository('PATCH', `${url}/registration_period/leader/updateById/${id}`, { params: {}, body: data });
  },


  /**
   * @description Xóa đợt đăng ký theo id
   */
  leaderDeleteRegisterPeriod: async (id: string) => {
    return await Repository('DELETE', `${url}/registration_period/leader/deleteById/${id}`, { params: {}, body: {} });
  },

  /**
   * @description Xóa mọi đợt đăng ký
   */
  leaderDeleteAllRegisterPeriod: async () => {
    return await Repository('DELETE', `${url}/registration_period/leader/removeAllRegistrationPeriod`, { params: {}, body: {} });
  },
}

export default RegisterPeriodLeaderAPI;
