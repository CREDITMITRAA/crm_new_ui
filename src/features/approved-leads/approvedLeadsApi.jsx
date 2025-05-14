import PrivateAxios from "../../api/PrivateAxios";

export async function fetchApprovedLeads(params){
    return PrivateAxios.get('/api/leads/get-all-leads-with-pagination', {params: params})
}

export async function updateApplicationStatusApi(payload){
    const response = await PrivateAxios.post('/api/leads/update-application-status', {...payload})
    return response
}