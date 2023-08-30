// servicing hours
const getServicingHours = (limit?: number, page?: number): string => `servicing-hours/get?limit=${limit}&page=${page}`
// post patient data
const postPatientData = (roleId: string):string=>`servicing-hours/post/role/${roleId}/data`
// update patient data
const putPatientData = (roleId: string, id: string): string=> `servicing-hours/put/role/${roleId}/data/${id}`
// delete patient data
const deletePatientData = (roleId: string, id: string, patientId: string): string=>`servicing-hours/delete/role/${roleId}/data/${id}/${patientId}`

// doctors
const getDoctors = (): string=>'doctors/get'
const postNewDoctor = (id: string):string=>`doctors/post/data/${id}`
const deleteProfileDoctor = (roleId: string, id: string):string=>`doctors/delete/role/${roleId}/data/${id}`
const putProfileDoctor = (roleId: string, id: string):string=>`doctors/put/role/${roleId}/data/${id}`

// verification
const getVerification = (): string => 'verification/get'
const putVerification = (userId: string): string => `verification/put/${userId}`
const postVerification = (): string => 'verification/post'
const deleteVerification = (id: string): string => `verification/delete/${id}`
// verification create new password and create jwt-token
const postCreateJwtToken = (userId?: string): string => `verification/post/forgot-password/create-new-password/${userId}/admin`
const getTokenJwt = (): string => 'verification/get/forgot-password/create-new-password'

// admin
const getAdmin = (): string => 'admin/get'
const putAdmin = (adminId: string): string => `admin/put/admin/${adminId}`
const putAdminVerification = (adminId: string): string => `admin/put/${adminId}`
const postAdmin = (): string => 'admin/post'

// black list jwt
const getBlackListJWT = (): string => 'black-list-jwt/get'
const postBlackListJWT = (): string => 'black-list-jwt/post'

export const endpoint= {
    getServicingHours,
    postPatientData,
    putPatientData,
    deletePatientData,
    getDoctors,
    postNewDoctor,
    deleteProfileDoctor,
    putProfileDoctor,
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