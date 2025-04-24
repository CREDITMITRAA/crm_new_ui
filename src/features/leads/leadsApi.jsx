import PrivateAxios from "../../api/PrivateAxios";

export async function fetchTotalLeadsCount(params) {
    const response = await PrivateAxios.get('/api/leads/get-total-leads-count', {params:params});
    return response.data.data;
}

export async function fetchTodaysLeadsCount(params){
    const response = await PrivateAxios.get('/api/leads/get-total-leads-count',{params:params})
    return response.data.data
}

export async function fetchAllLeads(params){
    const response = await PrivateAxios.get('/api/leads/get-all-leads-with-pagination', {params: params})
    return response
}

export async function fetchDistinctLeadSources(){
    const response = await PrivateAxios.get('/api/leads/get-all-lead-sources')
    console.log('lead sources = ', response.data.data);
    
    return response.data.data
}

export async function assignLeads(payload){
    const response = await PrivateAxios.post('/api/lead-assignments/assign',{...payload})
    return response
}

export async function uploadLeadsInBulk(payload){
    const response = await PrivateAxios.post('/api/leads/create-bulk-leads',payload)
    return response
}

export async function fetchAllInvalidLeads(params){
    const response = await PrivateAxios.get('/api/invalid-leads/get-all-invalid-leads', {params:params})
    return response
}

export async function fetchLeadByLeadId(leadId, params){
    const response = await PrivateAxios.get(`/api/leads/get-lead-by-id/${leadId}`,{params:params})
    return response
}

export async function updateLeadDetailsApi(leadId,payload){
    const response = await PrivateAxios.put(`/api/leads/update-lead-details/${leadId}`, {...payload})
    return response
}

export async function updateLeadStatusApi(payload){
    const response = await PrivateAxios.post('/api/leads/update-lead-status', {...payload})
    return response
}

export async function updateVerificationStatusApi(payload){
    const response = await PrivateAxios.post('/api/leads/update-verification-status',{...payload})
    return response
}

export async function fetchLeadsByAssignedUserId(params){
    return PrivateAxios.get(`/api/lead-assignments/get-leads-by-assigned-user-id`,{params:params})
}

export async function fetchDistinctInvalidLeadReasons(){
    return PrivateAxios.get('/api/invalid-leads/get-distinct-invalid-lead-reasons')
}

export async function fetchExEmployeesLeads(params){
    return PrivateAxios.get('/api/ex-employees/get-ex-employees-leads', {params:params})
}