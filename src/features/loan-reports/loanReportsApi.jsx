import PrivateAxios from "../../api/PrivateAxios";

export async function uploadLoanReport(payload){
    const response = await PrivateAxios.post('/api/loan-reports/add-loan-report',{...payload})
    return response
}

export async function fetchLoanReportsByLeadId(leadId){
    const response = await PrivateAxios.get(`/api/loan-reports/get-loan-reports-by-lead-id/${leadId}`)
    return response
}

export async function deleteLoanReportApi(payload){
    const response = await PrivateAxios.post('/api/loan-reports/delete-loan-report', {...payload})
    return response
}