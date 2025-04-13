import PrivateAxios from "../../api/PrivateAxios";

export async function fetchAllActivityLogs(params){
    const response = await PrivateAxios.get('/api/activity-logs/get-all-activity-logs',{params:params})
    return response
}