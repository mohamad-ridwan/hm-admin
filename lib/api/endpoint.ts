// servicing hours
const getServicingHours = (limit?: number, page?: number): string => `servicing-hours/get?limit=${limit}&page=${page}`
// data table
// patient registration
const getDataTablePatientRegis = (
    searchTxt: string,
    filterBy: string,
    selectDate: string,
    sortBy: string,
    currentPage: number,
    pageSize: number
):string=> `servicing-hours/get/data-table/patient-registration?searchTxt=${searchTxt}&filterBy=${filterBy}&selectDate=${selectDate}&sortBy=${sortBy}&currentPage=${currentPage}&pageSize=${pageSize}`
// confirmation patient
const getDataTableConfirmPatient = (
    searchTxt: string,
    roomBy: string,
    filterBy: string,
    selectDate: string,
    sortBy: string,
    currentPage: number,
    pageSize: number,
) => `servicing-hours/get/data-table/confirmation-patients?searchTxt=${searchTxt}&roomBy=${roomBy}&filterBy=${filterBy}&selectDate=${selectDate}&sortBy=${sortBy}&currentPage=${currentPage}&pageSize=${pageSize}`
// counter information (drug counter page)
const getCounterInformation = (counter: string)=>`servicing-hours/get/counter-information?counter=${counter}`
// drug counter patient
const getDataTableDrugCounter = (
    counterName: string,
    status: string,
    searchTxt: string,
    filterBy: string,
    sortBy: string,
    selectDate: string,
    currentPage: number,
    pageSize: number
):string=>`servicing-hours/get/data-table/drug-counter/${counterName}/${status}?searchTxt=${searchTxt}&filterBy=${filterBy}&sortBy=${sortBy}&selectDate=${selectDate}&currentPage=${currentPage}&pageSize=${pageSize}`
// finished treatment
const getDataTableFinishTreatment = (
    searchTxt: string,
    filterBy: string,
    selectDate: string,
    sortBy: string,
    currentPage: number,
    pageSize: number
):string=>`servicing-hours/get/data-table/finished-treatment?searchTxt=${searchTxt}&filterBy=${filterBy}&selectDate=${selectDate}&sortBy=${sortBy}&currentPage=${currentPage}&pageSize=${pageSize}`
// our doctor
const getDataTableOurDoctor = (
    searchTxt: string,
    filterBy: string,
    selectSpecialist: string,
    currentPage: number,
    pageSize: number
):string=>`servicing-hours/get/data-table/our-doctor?searchTxt=${searchTxt}&filterBy=${filterBy}&selectSpecialist=${selectSpecialist}&currentPage=${currentPage}&pageSize=${pageSize}`
// get rooms
const getDataTableRooms = (
    searchTxt: string,
    filterRoom: string,
    filterRoomActive: string,
    currentPage: number,
    pageSize: number
):string=>`servicing-hours/get/data-table/rooms?searchTxt=${searchTxt}&filterRoom=${filterRoom}&filterRoomActive=${filterRoomActive}&currentPage=${currentPage}&pageSize=${pageSize}`
// get counters
const getDataTableCounters = (
    searchTxt: string,
    counterType: string,
    roomActive: string,
    currentPage: number,
    pageSize: number
):string=>`servicing-hours/get/data-table/counters?searchTxt=${searchTxt}&counterType=${counterType}&roomActive=${roomActive}&currentPage=${currentPage}&pageSize=${pageSize}`
// post patient data
const postPatientData = (roleId: string): string => `servicing-hours/post/role/${roleId}/data`
// update patient data
const putPatientData = (roleId: string, id: string): string => `servicing-hours/put/role/${roleId}/data/${id}`
// delete patient data
const deletePatientData = (roleId: string, id: string, patientId: string): string => `servicing-hours/delete/role/${roleId}/data/${id}/${patientId}`

// doctors
const getDoctors = (): string => 'doctors/get'
const postNewDoctor = (id: string): string => `doctors/post/data/${id}`
const deleteProfileDoctor = (roleId: string, id: string): string => `doctors/delete/role/${roleId}/data/${id}`
const putProfileDoctor = (roleId: string, id: string): string => `doctors/put/role/${roleId}/data/${id}`

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

export const endpoint = {
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
    postBlackListJWT,
    getDataTableConfirmPatient,
    getDataTablePatientRegis,
    getCounterInformation,
    getDataTableDrugCounter,
    getDataTableFinishTreatment,
    getDataTableOurDoctor,
    getDataTableRooms,
    getDataTableCounters
}