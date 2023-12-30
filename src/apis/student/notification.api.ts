import Repository from "@/hooks/useRepositoryConfig";

const url = 'https://nodejsclusters-158883-0.cloudclusters.net/user_notification'


const NotificationAPI = {

    //tất cả đề tài 
    getAllNotificationStudent: async () => {
        return await Repository('GET', url + '/findAll', { params: {}, body: {} });
    },


}

export default NotificationAPI;

