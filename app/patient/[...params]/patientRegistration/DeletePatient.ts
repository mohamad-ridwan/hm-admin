'use client'

import { useState } from "react"
import { API } from "lib/api"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"

export function DeletePatient({params}: {params?: string}){
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false)

    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        dataPatientFinishTreatment,
        pushTriggedErr
    } = UsePatientData({params})

    async function pushDeletePatient(
        roleId: string,
        idDocument: string,
        patientId: string,
        errMessage: string
    ):Promise<{[key: string]: any}>{
        return await new Promise((resolve, reject)=>{
            API().APIDeletePatientData(
                roleId,
                idDocument,
                patientId
            )
            .then((res)=>{
                const newData = res as {[key: string]: any}
                if(newData?.patientId){
                    resolve(newData)
                }else{
                    pushTriggedErr(errMessage)
                }
            })
            .catch(err=>pushTriggedErr(errMessage))
        })
    }

    function clickDelete(patientId: string):void{
        if(loadingDelete === false){
            pushDeletePatient(
                'patient-registration',
                patientId,
                patientId,
                'There was an error deleting patient registration data. please try again'
            )
            .then(res=>{

            })
        }
    }

    return {}
}