import PrivateAxios from "../../api/PrivateAxios";

export async function createBackup(params){
    const response = await PrivateAxios.get('/api/backups/create-backup',{params:params})
    return response
}