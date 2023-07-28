'use client'

import { useState } from "react"
import { IconDefinition, faCalendarDays, faCheckToSlot, faCircleCheck, faCircleExclamation, faClock, faClockFour, faTrash, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { createHourFormat } from "lib/formats/createHourFormat"
import FormRegistrationData from "app/patient/[...params]/patientRegistration/FormRegistrationData"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import FormPatientRegistration from "app/patient/patient-registration/FormPatientRegistration"
import EditPatientRegistration from "app/patient/patient-registration/EditPatientRegistration"
import { StatusRegistration } from "./StatusRegistration"
import { DeletePatient } from "./DeletePatient"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"

export function PatientRegistration({ params }: { params: string }) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    // Form edit patient registration
    const {
        clickEdit,
        onPopupEdit,
        valueInputEditDetailPatient,
        clickClosePopupEdit,
        patientName,
        errEditInputDetailPatient,
        changeEditDetailPatient,
        changeDateEditDetailPatient,
        handleSubmitUpdate,
        setOnPopupEdit,
        idPatientToEdit,
        idLoadingEdit,
    } = FormPatientRegistration({ setOnModalSettings })

    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        dataPatientFinishTreatment,
    } = UsePatientData({ params })

    const {
        clickDelete,
        loadingDelete,
        isMenuActive,
        clickMenu
    } = DeletePatient({ params })

    const submissionDate = new Date(`${detailDataPatientRegis?.submissionDate?.submissionDate} ${detailDataPatientRegis?.submissionDate?.clock}`)

    const detailData: {
        title: string
        textInfo: string
        icon?: IconDefinition
    }[] = detailDataPatientRegis?.id ? [
        {
            title: "Patient Name",
            textInfo: detailDataPatientRegis.patientName,
        },
        {
            title: "Appointment Date",
            textInfo: createDateNormalFormat(detailDataPatientRegis.appointmentDate),
            icon: faCalendarDays
        },
        {
            title: 'Patient Complaints',
            textInfo: detailDataPatientRegis.patientMessage.patientComplaints
        },
        {
            title: 'Date of Birth',
            textInfo: createDateNormalFormat(detailDataPatientRegis.dateOfBirth)
        },
        {
            title: 'Email',
            textInfo: detailDataPatientRegis.emailAddress
        },
        {
            title: 'Phone',
            textInfo: detailDataPatientRegis.phone
        },
        {
            title: 'Patient ID',
            textInfo: detailDataPatientRegis.id
        },
        {
            title: 'Messages from patient',
            textInfo: detailDataPatientRegis.patientMessage.message
        },
        {
            title: "Submission Date",
            textInfo: createDateNormalFormat(detailDataPatientRegis.submissionDate.submissionDate),
            icon: faCalendarDays
        },
        {
            title: "Confirmation Hour",
            textInfo: createHourFormat(submissionDate),
            icon: faClock
        }
    ] : []

    function onDeletePatient(): void {
        if (loadingDelete === false) {
            setOnModalSettings({
                clickClose: () => setOnModalSettings({} as PopupSettings),
                title: `Delete all data from patient "${detailDataPatientRegis?.patientName}"?`,
                classIcon: 'text-font-color-2',
                iconPopup: faTrash,
                actionsData: [
                    {
                        nameBtn: 'Yes',
                        classBtn: 'hover:bg-white',
                        classLoading: 'hidden',
                        clickBtn: () => {
                            clickDelete(detailDataPatientRegis?.id)
                            setOnModalSettings({} as PopupSettings)
                        },
                        styleBtn: {
                            padding: '0.5rem',
                            marginRight: '0.6rem',
                            marginTop: '0.5rem'
                        }
                    },
                    {
                        nameBtn: 'Cancel',
                        classBtn: 'bg-white border-none',
                        classLoading: 'hidden',
                        clickBtn: () => setOnModalSettings({} as PopupSettings),
                        styleBtn: {
                            padding: '0.5rem',
                            marginTop: '0.5rem',
                            color: '#495057'
                        }
                    },
                ]
            })
        }
    }

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Edit',
            classWrapp: 'cursor-pointer',
            click: () => {
                clickEdit(detailDataPatientRegis?.id, detailDataPatientRegis?.patientName)
                setOnPopupEdit(true)
                clickMenu()
            }
        },
        {
            name: 'Delete',
            classWrapp: loadingDelete ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'text-red-default cursor-pointer',
            click: () => {
                onDeletePatient()
                if (loadingDelete === false) {
                    clickMenu()
                }
            }
        }
    ]

    return (
        <>
            {/* popup edit */}
            {onPopupEdit && (
                <EditPatientRegistration
                    valueInputEditDetailPatient={valueInputEditDetailPatient}
                    patientName={patientName}
                    errEditInputDetailPatient={errEditInputDetailPatient}
                    clickClosePopupEdit={clickClosePopupEdit}
                    changeDateEditDetailPatient={changeDateEditDetailPatient}
                    changeEditDetailPatient={changeEditDetailPatient}
                    handleSubmitUpdate={handleSubmitUpdate}
                    idPatientToEdit={idPatientToEdit}
                    idLoadingEdit={idLoadingEdit}
                />
            )}

            {onModalSettings?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={onModalSettings.clickClose}
                        title={onModalSettings.title}
                        classIcon={onModalSettings.classIcon}
                        iconPopup={onModalSettings.iconPopup}
                    >
                        {onModalSettings.actionsData.length > 0 && onModalSettings.actionsData.map((btn, idx) => {
                            return (
                                <Button
                                    key={idx}
                                    nameBtn={btn.nameBtn}
                                    classBtn={btn.classBtn}
                                    classLoading={btn.classLoading}
                                    clickBtn={btn.clickBtn}
                                    styleBtn={btn.styleBtn}
                                />
                            )
                        })}
                    </SettingPopup>
                </ContainerPopup>
            )}

            <Container
                isNavleft={false}
                title="Patient of"
                desc={detailDataPatientRegis?.patientName}
                classHeadDesc="text-3xl font-semibold flex-col"
            >
                {dataPatientFinishTreatment?.isCanceled === false && (
                    <StatusRegistration
                        icon={faCheckToSlot}
                        title="Have Finished Treatment"
                        classText="text-green"
                    />
                )}
                {dataPatientFinishTreatment?.isCanceled && (
                    <StatusRegistration
                        icon={faUserXmark}
                        title="Canceled"
                        classText="text-red-default"
                    />
                )}
                {!dataPatientFinishTreatment?.id && (
                    <StatusRegistration
                        icon={faClockFour}
                        title="In Progress"
                        classText="text-color-default-old"
                    />
                )}

                <Container
                    isNavleft={false}
                    classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
                    maxWidth="auto"
                >
                    <HeadInfo
                        title={!dataConfirmPatient?.id ? 'Not yet confirmed' : 'Confirmed'}
                        titleInfo="Patient Information"
                        icon={!dataConfirmPatient?.id ? faCircleExclamation : faCircleCheck}
                        classTitle={!dataConfirmPatient?.id ? 'text-orange-young' : ''}
                        actionsData={actionsMenu}
                        clickMenu={clickMenu}
                        classWrappMenu={`${isMenuActive ? 'flex' : 'hidden'} right-9`}
                    />

                    <div
                        className="w-full flex flex-wrap justify-between"
                    >
                        {detailData.length > 0 && detailData.map((item, index) => {
                            return (
                                <CardInfo
                                    key={index}
                                    title={item.title}
                                    textInfo={item.textInfo}
                                    icon={item?.icon}
                                />
                            )
                        })}
                    </div>
                </Container>

                {/* Form confirmation of patient registration */}
                {!dataConfirmPatient?.id && !dataPatientFinishTreatment?.id && (
                    <FormRegistrationData
                        params={params} />
                )}
            </Container>
        </>
    )
}