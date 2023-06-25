type EndpointType = {
    [key: string]: (params?: string) => string
}

// verification
const getVerification = (): string => 'v13/verification/get'
const putVerification = (userId?: string): string => `v13/verification/put/${userId}`
const postVerification = (): string => 'v13/verification/post'
const deleteVerification = (id?: string): string => `v13/verification/delete/${id}`
// verification create new password and create jwt-token
const postCreateJwtToken = (userId?: string): string => `v13/verification/post/forgot-password/create-new-password/${userId}/admin`
const getTokenJwt = (): string => 'v13/verification/get/forgot-password/create-new-password'

// admin
const getAdmin = (): string => 'v14/admin/get'
const putAdmin = (adminId?: string): string => `v14/admin/put/admin/${adminId}`
const putAdminVerification = (adminId?: string): string => `v14/admin/put/${adminId}`
const postAdmin = (): string => 'v14/admin/post'

// black list jwt
const getBlackListJWT = (): string => 'v15/black-list-jwt/get'
const postBlackListJWT = (): string => 'v15/black-list-jwt/post'

export const endpoint: EndpointType = {
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