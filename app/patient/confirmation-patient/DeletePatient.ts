'use client'

import ServicingHours from "lib/actions/ServicingHours"
import { API } from "lib/api"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createHourFormat } from "lib/dates/createHourFormat"
import { DataTableContentT } from "lib/types/FilterT"
import { UserT } from "lib/types/ZustandT.types"
import { useEffect, useState } from "react"

type Props = {
    user: UserT
    dataColumns: DataTableContentT[]
}

export function DeletePatient({
    user,
    dataColumns
}: Props) {
    const [loadingIdPatientsDelete, setLoadingIdPatientsDelete] = useState<string[]>([])
    const [namePatientToDelete, setNamePatientToDelete] = useState<string | null>(null)
    const [idPatientToDelete, setIdPatientToDelete] = useState<string>('')
    const [onPopupChooseDelete, setOnPopupChooseDelete] = useState<boolean>(false)

    const {
        dataConfirmationPatients,
        pushTriggedErr
    } = ServicingHours()

    function clickDeleteIcon(
        patientId: string,
        patientName: string
    ): void {
        const findId = loadingIdPatientsDelete.find(id => id === patientId)
        if (!findId) {
            setNamePatientToDelete(patientName)
            setIdPatientToDelete(patientId)
            setOnPopupChooseDelete(true)
        }
    }

    function closePopupChooseDelete() {
        setOnPopupChooseDelete(false)
    }

    function deleteActionCallback(
        roleId: string,
        patientId: string,
        mainPatientId: string,
        alertMessage?: string,
        errMessage?: string,
        endDeleted?: boolean,
        cb?: () => void
    ): void {
        API().APIDeletePatientData(
            roleId,
            patientId,
            mainPatientId
        )
            .then((result) => {
                if (typeof cb === 'function') {
                    cb()
                }
                if (endDeleted) {
                    const getRes: {[key: string]: any} = result as {}
                    const removeIdLoading = loadingIdPatientsDelete.filter(id=>id !== getRes?.patientId)
                    setLoadingIdPatientsDelete(removeIdLoading)
                    alert(alertMessage)
                }
            })
            .catch(err => {
                pushTriggedErr(errMessage as string)
            })
    }

    // click delete detail and confirm data
    function clickDeleteDetailAndConfirmData(): void {
        if (window.confirm(`Delete details and confirmation data from patient "${namePatientToDelete}"?`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)
            deleteActionCallback(
                'confirmation-patients',
                findIdConfirmData?.id as string,
                idPatientToDelete,
                '',
                'There was an error deleting patient data details and confirmation',
                false,
                () => deleteActionCallback(
                    'patient-registration',
                    idPatientToDelete,
                    idPatientToDelete,
                    'delete successfully',
                    'There was an error deleting patient data details and confirmation',
                    true
                )
            )
        }
    }

    function clickDeleteConfirmationData(): void {
        if (window.confirm(`Delete confirmation data from "${namePatientToDelete}" patient`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const findIdConfirmData = dataConfirmationPatients?.find(patient => patient.patientId === idPatientToDelete)

            deleteActionCallback(
                'confirmation-patients',
                findIdConfirmData?.id as string,
                idPatientToDelete,
                'delete successfully',
                'There was an error deleting patient confirmation data',
                true
            )
        }
    }

    function clickCancelTreatment(): void {
        if (window.confirm(`cancel the registration of patient ${namePatientToDelete}?`)) {
            setLoadingIdPatientsDelete((current) => [...current, idPatientToDelete])
            setOnPopupChooseDelete(false)

            const dataFinishTreatment = {
                patientId: idPatientToDelete,
                confirmedTime: {
                    dateConfirm: createDateFormat(new Date()),
                    confirmHour: createHourFormat(new Date())
                },
                adminInfo: { adminId: user.user?.id as string }
            }
            API().APIPostPatientData(
                'finished-treatment',
                dataFinishTreatment
            )
                .then(res => {
                    deleteActionCallback(
                        'confirmation-patients',
                        idPatientToDelete,
                        idPatientToDelete,
                        'Successfully cancel patient registration',
                        'There was an error deleting patient confirmation data',
                        true
                    )
                })
                .catch(err => {
                    pushTriggedErr('a server error occurred while adding data to the treatment is complete. please try again')
                })
        }
    }

    // action delete
    function loadingDeleteIcon(): void {
        if (dataColumns.length > 0) {
            dataColumns.forEach(patient => {
                const loadingElement = document.getElementById(`loadDelete${patient.id}`) as HTMLElement
                const iconDelete = document.getElementById(`iconDelete${patient.id}`) as HTMLElement

                if (loadingElement && iconDelete) {
                    loadingElement.style.display = 'none'
                    iconDelete.style.display = 'flex'
                }

                loadingIdPatientsDelete.forEach(id => {
                    const loadingElement = document.getElementById(`loadDelete${id}`) as HTMLElement
                    const iconDelete = document.getElementById(`iconDelete${id}`) as HTMLElement

                    if (loadingElement && iconDelete) {
                        loadingElement.style.display = 'flex'
                        iconDelete.style.display = 'none'
                    }
                })
            })
        }
    }

    useEffect(() => {
        loadingDeleteIcon()
    }, [loadingIdPatientsDelete, dataColumns])

    return {
        clickDeleteIcon,
        namePatientToDelete,
        onPopupChooseDelete,
        setOnPopupChooseDelete,
        closePopupChooseDelete,
        clickDeleteDetailAndConfirmData,
        clickDeleteConfirmationData,
        clickCancelTreatment
    }
}