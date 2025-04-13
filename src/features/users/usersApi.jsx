import PrivateAxios from "../../api/PrivateAxios";

export async function fetchUsersNameAndId(){
    const response = await PrivateAxios.get('/api/users/get-users-name-and-id')
    return response.data.data
}