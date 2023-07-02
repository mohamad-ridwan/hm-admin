type EndpointType = {
    [key: string]: (params?: string, params2?: string) => string
}

// servicing hours
const getServicingHours = () => 'v8/servicing-hours/get'
// update patient data
const putPatientData = (roleId?: string, id?: string)=> `v8/servicing-hours/put/role/${roleId}/data/${id}`
// delete patient data
const deletePatientData = (roleId?: string, id?: string)=>`v8/servicing-hours/delete/role/${roleId}/data/${id}`

// verification
const getVerification = () => 'v13/verification/get'
const putVerification = (userId?: string) => `v13/verification/put/${userId}`
const postVerification = () => 'v13/verification/post'
const deleteVerification = (id?: string) => `v13/verification/delete/${id}`
// verification create new password and create jwt-token
const postCreateJwtToken = (userId?: string) => `v13/verification/post/forgot-password/create-new-password/${userId}/admin`
const getTokenJwt = () => 'v13/verification/get/forgot-password/create-new-password'

// admin
const getAdmin = () => 'v14/admin/get'
const putAdmin = (adminId?: string) => `v14/admin/put/admin/${adminId}`
const putAdminVerification = (adminId?: string) => `v14/admin/put/${adminId}`
const postAdmin = () => 'v14/admin/post'

// black list jwt
const getBlackListJWT = () => 'v15/black-list-jwt/get'
const postBlackListJWT = () => 'v15/black-list-jwt/post'

export const endpoint: EndpointType = {
    getServicingHours,
    putPatientData,
    deletePatientData,
    getVerification,
    putVerification,
    postVerification,
    deleteVerification,
    postCreateJwtToken,
    getTokenJwt,
    getAdmin,
    putAdmin,
    putAdminVerification,
    postAdmin,
    getBlackListJWT,
    postBlackListJWT
}