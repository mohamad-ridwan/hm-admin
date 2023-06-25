type EndpointType = {
    [key: string]: (params?: string)=>string
}

// verification
const getVerification = ():string=>'v13/verification/get'
const putVerification = (userId?: string):string=>`v13/verification/put/${userId}`
const postVerification = ():string=> 'v13/verification/post'
const deleteVerification = (id?: string):string=>`v13/verification/delete/${id}`

// admin
const getAdmin = (): string=> 'v14/admin/get'
const putAdmin = (adminId?: string):string=>`v14/admin/put/admin/${adminId}`
const putAdminVerification = (adminId?: string):string=>`v14/admin/put/${adminId}`
const postAdmin = (): string=> 'v14/admin/post'

export const endpoint: EndpointType = {
    getVerification,
    putVerification,
    postVerification,
    deleteVerification,
    getAdmin,
    putAdmin,
    putAdminVerification,
    postAdmin
}