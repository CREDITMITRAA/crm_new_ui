import PrivateAxios from "../../api/PrivateAxios";

export async function fetchLeadDocumentsByLeadId(params){
    const response = await PrivateAxios.get('/api/lead-documents/get-lead-documents-by-lead-id',{params:params})
    return response
}

export async function uploadLeadDocumentApi(formData, ){
    return PrivateAxios.post('/api/uploads/upload-file', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
}

export async function deleteLeadDocumentApi(payload){
  const response = await PrivateAxios.post('/api/lead-documents/remove-lead-document-by-lead-id', {...payload})
  return response
}