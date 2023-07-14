'use client'

import { faCalendarDays, faCheckToSlot, faCircleCheck, faCircleExclamation, faClock, faClockFour, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
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

    const submissionDate = new Date(`${detailDataPatientRegis?.submissionDate?.submissionDate} ${detailDataPatientRegis?.submissionDate?.clock}`)

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
                    <div
                        className="flex justify-end overflow-hidden"
                    >
                        <div
                            className="flex flex-wrap items-center text-green mt-2"
                        >
                            <FontAwesomeIcon
                                icon={faCheckToSlot}
                                className="text-3xl mr-2 justify-end"
                            />
                            <h1
                                className="text-3xl font-semibold"
                            >Have Finished Treatment</h1>
                        </div>
                    </div>
                )}
                {dataPatientFinishTreatment?.isCanceled && (
                    <div
                        className="flex justify-end overflow-hidden"
                    >
                        <div
                            className="flex flex-wrap items-center text-red-default mt-2"
                        >
                            <FontAwesomeIcon
                                icon={faUserXmark}
                                className="text-3xl mr-2 justify-end"
                            />
                            <h1
                                className="text-3xl font-semibold"
                            >Canceled</h1>
                        </div>
                    </div>
                )}
                {!dataPatientFinishTreatment?.id && (
                    <div
                    className="flex justify-end overflow-hidden"
                >
                    <div
                        className="flex flex-wrap items-center text-color-default-old"
                    >
                        <FontAwesomeIcon
                            icon={faClockFour}
                            className="text-3xl mr-2 justify-end"
                        />
                        <h1
                            className="text-3xl font-semibold"
                        >In Process</h1>
                    </div>
                </div>
                )}

                <Container
                    isNavleft={false}
                    classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
                    maxWidth="auto"
                >
                    {!dataConfirmPatient?.id && (
                        <HeadInfo
                            title='Not yet confirmed'
                            titleInfo="Patient Information"
                            icon={faCircleExclamation}
                            classTitle="text-orange-young"
                        />
                    )}

                    {dataConfirmPatient?.id && (
                        <HeadInfo
                            title='Confirmed'
                            titleInfo="Patient Information"
                            icon={faCircleCheck}
                        />
                    )}

                    <div
                        className="w-full flex flex-wrap justify-between"
                    >
                        {detailDataPatientRegis?.id && (
                            <>
                                <CardInfo
                                    title='Patient Name'
                                    textInfo={detailDataPatientRegis.patientName}
                                />
                                <CardInfo
                                    title="Appointment Date"
                                    textInfo={createDateNormalFormat(detailDataPatientRegis.appointmentDate)}
                                    icon={faCalendarDays}
                                />
                                <CardInfo
                                    title='Patient Complaints'
                                    textInfo={detailDataPatientRegis.patientMessage.patientComplaints}
                                />
                                <CardInfo
                                    title='Date of Birth'
                                    textInfo={createDateNormalFormat(detailDataPatientRegis.dateOfBirth)}
                                />
                                <CardInfo
                                    title='Email'
                                    textInfo={detailDataPatientRegis.emailAddress}
                                />
                                <CardInfo
                                    title='Phone'
                                    textInfo={detailDataPatientRegis.phone}
                                />
                                <CardInfo
                                    title='Patient ID'
                                    textInfo={detailDataPatientRegis.id}
                                />
                                <CardInfo
                                    title='Messages from patient'
                                    textInfo={detailDataPatientRegis.patientMessage.message}
                                />
                                <CardInfo
                                    title="Submission Date"
                                    textInfo={createDateNormalFormat(detailDataPatientRegis.submissionDate.submissionDate)}
                                    icon={faCalendarDays}
                                />
                                <CardInfo
                                    title="Confirmation Hour"
                                    textInfo={createHourFormat(submissionDate)}
                                    icon={faClock}
                                />
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