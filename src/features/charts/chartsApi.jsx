import PrivateAxios from "../../api/PrivateAxios";

export async function fetchChartDataByChartTypes(params){
    const response = await PrivateAxios.get('/api/dashboard/get-charts-data', {params:params})
    return response
}

export async function fetchChartDataByChartTypes2(params){
    const response = await PrivateAxios.get('/api/dashboard/get-charts-data', {params:params})
    return response
}