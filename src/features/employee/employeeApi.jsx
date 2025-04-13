import PrivateAxios from "../../api/PrivateAxios";

export async function fetchAllEmployees(params){
    const response = await PrivateAxios.get('/api/users/get-all-users',{params:params})
    return response.data
}

export async function addEmployeeApi(payload){
    const response = await PrivateAxios.post('/api/users',{...payload})
    return response
}

export async function updateEmployeeApi(userId,payload){
    const response = await PrivateAxios.put(`/api/users/${userId}`,{...payload})
    return response
}

export async function deleteEmployeeApi(userId){
    const response = await PrivateAxios.delete(`/api/users/${userId}`)
    return response
}