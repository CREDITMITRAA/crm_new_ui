import PrivateAxios from "../../api/PrivateAxios";

export async function fetchWalkIns(params){
    const response = await PrivateAxios.get('/api/walk-ins/get-walk-ins',{params:params})
    console.log('walk ins = ', response.data.pagination);
    
    return response.data
}

export async function fetchWalkInsCount(params){
    const response = await PrivateAxios.get('/api/walk-ins/get-walk-ins-count', {params:params})
    return response.data.data
}

export async function updateApplicationStatusApi(payload){
    const response = await PrivateAxios.post('/api/leads/update-application-status', {...payload})
    return response
}

export async function scheduleWalkInApi(payload){
    const response = await PrivateAxios.post('/api/walk-ins/schedule-walk-in',{...payload})
    return response
}

export async function updateWalkInOrCallStatusApi(payload){
    const response  = await PrivateAxios.post('/api/walk-ins/update-walk-in-status', {...payload})
    return response
}