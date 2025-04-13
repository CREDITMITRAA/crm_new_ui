import PrivateAxios from "../../api/PrivateAxios";

export async function fetchRecentActivityNotesByLeadId(params){
    const response = await PrivateAxios.get('/api/activities/get-recent-activity-notes-by-lead-id',{params:params})
    return response
}

export async function addActivityApi(payload){
    const response = await PrivateAxios.post('/api/activities/add-activity',{...payload})
    return response
}

export async function fetchRecentActivityLeadId(params){
    const response = await PrivateAxios.get('/api/activities/get-recent-activity-by-lead-id',{params:params})
    return response
}