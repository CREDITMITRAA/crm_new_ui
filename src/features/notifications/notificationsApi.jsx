import PrivateAxios from "../../api/PrivateAxios";

export async function acknowledgeNotificationApi(notificationId){
    const response = await PrivateAxios.put(`/api/notifications/acknowledge-notification/${notificationId}`)
    return response
}

export async function fetchNotificationsByEmployeeId(params){
    const response = await PrivateAxios.get('/api/notifications/get-notifications-by-employee-id', {params:params})
    return response
}