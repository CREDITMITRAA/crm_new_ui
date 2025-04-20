import PrivateAxios from "../../api/PrivateAxios";

export async function fetchUsersNameAndId(){
    const response = await PrivateAxios.get('/api/users/get-users-name-and-id')
    return response.data.data
}

export async function fetchUserProfileImages(params){
    const response = await PrivateAxios.get('/api/profile-image-urls/get-all-profile-image-urls', {params:params})
    return response.data.data
}