'use client'

import { IconDefinition, faCalendarDays, faCheckToSlot, faCircleCheck, faCircleExclamation, faClock, faClockFour, faPencil, faTrash, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT, RoomTreatmentT } from "lib/types/PatientT.types"
import { createHourFormat } from "lib/dates/createHourFormat"
import FormRegistrationData from "app/patient/[...params]/patientRegistration/FormRegistrationData"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import FormPatientRegistration from "app/patient/patient-registration/FormPatientRegistration"
import EditPatientRegistration from "app/patient/patient-registration/EditPatientRegistration"
import { StatusRegistration } from "./StatusRegistration"
import { DeletePatient } from "./DeletePatient"

type ActionProps = {
    pushTriggedErr: (message: string) => void
}

type Props = ActionProps & {
    detailDataPatientRegis: PatientRegistrationT
    dataConfirmPatient: ConfirmationPatientsT
    dataPatientFinishTreatment: PatientFinishTreatmentT
    doctors: ProfileDoctorT[] | undefined
    dataRooms: RoomTreatmentT[] | undefined
    idPatientRegistration: string
    dataConfirmationPatients: ConfirmationPatientsT[] | undefined
    dataPatientRegis: PatientRegistrationT[] | undefined
}

export function PatientRegistration({
    detailDataPatientRegis,
    dataConfirmPatient,
    dataPatientFinishTreatment,
    params,
    doctors,
    dataRooms,
    idPatientRegistration,
    dataConfirmationPatients,
    dataPatientRegis,
    pushTriggedErr,
}: Props & { params: string }) {
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
    } = FormPatientRegistration()

    const {} = DeletePatient({params})

    const submissionDate = new Date(`${detailDataPatientRegis?.submissionDate?.submissionDate} ${detailDataPatientRegis?.submissionDate?.clock}`)

    const detailData: {
        title: string
        textInfo: string
        icon?: IconDefinition
    }[] = detailDataPatientRegis?.id ? [
        {
            title: "Patient Name",
            textInfo: createDateNormalFormat(detailDataPatientRegis.appointmentDate),
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
                        title="In Process"
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
                        editIcon={faPencil}
                        deleteIcon={faTrash}
                        clickEdit={()=>{
                            clickEdit(detailDataPatientRegis?.id, detailDataPatientRegis?.patientName)
                            setOnPopupEdit(true)
                        }}
                    />

                    <div
                        className="w-full flex flex-wrap justify-between"
                    >
                        {detailDataPatientRegis?.id && (
                            <>
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
                            </>
                        )}
                    </div>
                </Container>

                {/* Form confirmation of patient registration */}
                {!dataConfirmPatient?.id && !dataPatientFinishTreatment?.id && (
                    <FormRegistrationData
                        params={params}
                        doctors={doctors}
                        dataRooms={dataRooms}
                        appointmentDate={createDateNormalFormat(detailDataPatientRegis.appointmentDate)}
                        dataConfirmationPatients={dataConfirmationPatients}
                        idPatientRegistration={idPatientRegistration}
                        dataPatientRegis={dataPatientRegis}
                        pushTriggedErr={pushTriggedErr}
                    />
                )}
            </Container>
        </>
    )
}