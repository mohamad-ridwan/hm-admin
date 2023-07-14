import { faCalendarDays, faCheck, faClock, faListOl, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Container } from "components/Container";
import { CardInfo } from "components/dataInformation/CardInfo";
import { HeadInfo } from "components/dataInformation/HeadInfo";
import { createDateFormat } from "lib/dates/createDateFormat";
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat";
import { spaceString } from "lib/regex/spaceString";
import { ProfileDoctorT } from "lib/types/DoctorsT.types";
import { ConfirmationPatientsT, PatientRegistrationT, RoomTreatmentT } from "lib/types/PatientT.types";

type Props = {
    dataConfirmPatient: ConfirmationPatientsT
    detailDataPatientRegis: PatientRegistrationT
    dataRooms: RoomTreatmentT[] | undefined
    doctors: ProfileDoctorT[] | undefined
}

export function ConfirmationPatient({
    dataConfirmPatient,
    detailDataPatientRegis,
    dataRooms,
    doctors
}: Props) {
    const findCurrentRoom = dataRooms?.find(room => room.id === dataConfirmPatient?.roomInfo?.roomId)
    const findCurrentDoctor = doctors?.find(doctor => doctor.id === dataConfirmPatient?.doctorInfo?.doctorId)

    const getAppointmentDate = createDateNormalFormat(detailDataPatientRegis?.appointmentDate)
    const dayOfAppointment = getAppointmentDate?.split(',')[1]?.replace(spaceString, '')
    const dateOfAppointment = getAppointmentDate?.split(',')[0]
    const doctorIsHoliday = findCurrentDoctor?.holidaySchedule?.find(date => date.date === createDateFormat(dateOfAppointment))
    const doctorIsOnCurrentDay = findCurrentDoctor?.doctorSchedule?.find(day => day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
    const doctorIsAvailable = !doctorIsHoliday ? doctorIsOnCurrentDay ? true : false : false

    return (
        <Container
            isNavleft={false}
            classHeadDesc="text-3xl font-semibold flex-col"
        >
            <Container
                isNavleft={false}
                classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
                maxWidth="auto"
            >
                <HeadInfo
                    title={dataConfirmPatient?.roomInfo?.queueNumber}
                    titleInfo="Confirmation Data Information"
                    icon={faListOl}
                    iconRight={doctorIsAvailable ? faCheck : faTriangleExclamation}
                    titleRight={doctorIsAvailable ? 'Doctor available' : 'Doctor is not available'}
                    styleHeadTop={{
                        justifyContent: 'space-between'
                    }}
                    styleHeadRight={{
                        color: doctorIsAvailable ? '#288bbc' : '#ff296d'
                    }}
                />
                <div
                    className="w-full flex flex-wrap justify-between"
                >
                    {dataConfirmPatient?.id && (
                        <>
                            <CardInfo
                                title='Presence State'
                                textInfo={dataConfirmPatient.roomInfo.presence.toUpperCase()}
                            />
                            <CardInfo
                                title='Queue Number'
                                textInfo={dataConfirmPatient.roomInfo.queueNumber}
                                icon={faListOl}
                            />
                            <CardInfo
                                title='Treatment Hours'
                                textInfo={dataConfirmPatient.dateConfirmInfo.treatmentHours}
                                icon={faClock}
                            />
                            <CardInfo
                                title='Room Name'
                                textInfo={findCurrentRoom?.room}
                            />
                            <CardInfo
                                title='Doctor Name'
                                textInfo={findCurrentDoctor?.name}
                            />
                            <CardInfo
                                title='Doctor Specialist'
                                textInfo={findCurrentDoctor?.deskripsi}
                            />
                            <CardInfo
                                title='Doctor ID'
                                textInfo={dataConfirmPatient.doctorInfo.doctorId}
                            />
                            <CardInfo
                                title='Confirmation Hour'
                                textInfo={dataConfirmPatient.dateConfirmInfo.confirmHour}
                                icon={faClock}
                            />
                            <CardInfo
                                title='Confirmed Date'
                                textInfo={createDateNormalFormat(dataConfirmPatient.dateConfirmInfo.dateConfirm)}
                                icon={faCalendarDays}
                            />
                        </>
                    )}
                </div>
            </Container>
        </Container>
    )
}