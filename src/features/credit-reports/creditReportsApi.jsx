import PrivateAxios from "../../api/PrivateAxios";

export async function uploadCreditReport(payload){
    const response = await PrivateAxios.post('/api/credit-reports/add-credit-report',{...payload})
    return response
}

export async function fetchCreditReportsByLeadId(leadId){
    const response = await PrivateAxios.get(`/api/credit-reports/get-credit-reports-by-lead-id/${leadId}`)
    return response
}

export async function deleteCreditReportApi(payload){
    const response = await PrivateAxios.post('/api/credit-reports/delete-credit-report', {...payload})
    return response
}