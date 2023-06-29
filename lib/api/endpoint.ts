type EndpointType = {
    [key: string]: (params?: string) => string
}

// servicing hours
const getServicingHours = () => 'v8/servicing-hours/get'

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