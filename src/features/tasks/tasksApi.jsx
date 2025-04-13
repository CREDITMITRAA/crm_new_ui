import PrivateAxios from "../../api/PrivateAxios";

export async function fetchAllTasks(params){
    const response = await PrivateAxios.get('/api/activities/get-all-tasks',{params:params})
    return response.data
}

export async function updateTaskStatusApi(payload){
    const response = await PrivateAxios.post('/api/activities/update-task-status', {...payload})
    return response
}