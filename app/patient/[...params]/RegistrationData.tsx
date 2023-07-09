'use client'

import { useState } from "react"
import { faCalendarDays, faCheckToSlot, faCircleCheck, faCircleExclamation } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { AdminT } from "lib/types/AdminT.types"
import { ProfileDoctorT } from "lib/types/DoctorsT.types"
import { ConfirmationPatientsT, PatientFinishTreatmentT, PatientRegistrationT, RoomTreatmentT } from "lib/types/PatientT.types"
import { createHourFormat } from "lib/dates/createHourFormat"
import FormRegistrationData from "app/patient/[...params]/FormRegistrationData"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"

type Props = {
    detailDataPatientRegis: PatientRegistrationT
    dataConfirmPatient: ConfirmationPatientsT
    dataPatientFinishTreatment: PatientFinishTreatmentT
}

export function RegistrationData({
    detailDataPatientRegis,
    dataConfirmPatient,
    dataPatientFinishTreatment,
    params
}: Props & { params: string }) {
    const submissionDate = new Date(`${detailDataPatientRegis?.submissionDate?.submissionDate} ${detailDataPatientRegis?.submissionDate?.clock}`)

    return (
        <Container
            isNavleft={false}
            title="Patient of"
            desc={params[3]}
            classHeadDesc="text-3xl font-semibold flex-col"
        >
            {dataPatientFinishTreatment?.id && (
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
                                icon={faCalendarDays}
                            />
                        </>
                    )}
                </div>
            </Container>

            {/* Form confirmation of patient registration */}
            <FormRegistrationData/>
        </Container>
    )
}