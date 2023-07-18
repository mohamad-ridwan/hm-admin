'use client'

import { IconDefinition, faCalendarDays, faCheck, faClock, faDownload, faListOl, faPaperPlane, faPencil, faTrash, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Container } from "components/Container";
import { CardInfo } from "components/dataInformation/CardInfo";
import { HeadInfo } from "components/dataInformation/HeadInfo";
import ServicingHours from "lib/actions/ServicingHours";
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData";
import { createDateFormat } from "lib/dates/createDateFormat";
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat";
import { spaceString } from "lib/regex/spaceString";
import { FormConfirmation } from "./FormConfirmation";

export function ConfirmationPatient({ params }: { params: string }) {
    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        drugCounterPatient,
        doctors,
        dataRooms,
    } = UsePatientData({ params })

    const {
        loadGetDataAdmin,
        dataAdmin
    } = ServicingHours()

    const findCurrentRoom = dataRooms?.find(room => room.id === dataConfirmPatient?.roomInfo?.roomId)
    const findCurrentDoctor = doctors?.find(doctor => doctor.id === dataConfirmPatient?.doctorInfo?.doctorId)

    const getAppointmentDate = createDateNormalFormat(detailDataPatientRegis?.appointmentDate)
    const dayOfAppointment = getAppointmentDate?.split(',')[1]?.replace(spaceString, '')
    const dateOfAppointment = getAppointmentDate?.split(',')[0]
    const doctorIsHoliday = findCurrentDoctor?.holidaySchedule?.find(date => date.date === createDateFormat(dateOfAppointment))
    const doctorIsOnCurrentDay = findCurrentDoctor?.doctorSchedule?.find(day => day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
    const doctorIsAvailable = !doctorIsHoliday ? doctorIsOnCurrentDay ? true : false : false

    const findAdmin = !loadGetDataAdmin && typeof dataAdmin !== 'undefined' ? dataAdmin.find(admin=>admin.id === dataConfirmPatient?.adminInfo?.adminId) : null

    const detailData: {
        title: string
        textInfo: string
        icon?: IconDefinition
    }[] = dataConfirmPatient?.id ? [
        {
            title: 'Doctor Name',
            textInfo: findCurrentDoctor?.name as string,
        },
        {
            title: 'Doctor Specialist',
            textInfo: findCurrentDoctor?.deskripsi as string,
        },
        {
            title: 'Room Name',
            textInfo: findCurrentRoom?.room as string,
        },
        {
            title: 'Doctor ID',
            textInfo: dataConfirmPatient.doctorInfo.doctorId,
        },
        {
            title: 'Queue Number',
            textInfo: dataConfirmPatient.roomInfo.queueNumber,
            icon: faListOl
        },
        {
            title: 'Treatment Hours',
            textInfo: dataConfirmPatient.dateConfirmInfo.treatmentHours,
            icon: faClock
        },
        {
            title: 'Confirmation Hour',
            textInfo: dataConfirmPatient.dateConfirmInfo.confirmHour,
            icon: faClock
        },
        {
            title: 'Confirmed Date',
            textInfo: createDateNormalFormat(dataConfirmPatient.dateConfirmInfo.dateConfirm),
            icon: faCalendarDays
        },
        {
            title: 'Admin Email',
            textInfo: findAdmin?.email as string,
        },
        {
            title: 'Admin ID',
            textInfo: findAdmin?.id as string,
        },
    ] : []

    return (
        <>
            {dataConfirmPatient?.id && (
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
                            deleteIcon={faTrash}
                            editIcon={faPencil}
                            downloadIcon={faDownload}
                            sendIcon={faPaperPlane}
                            clickSend={()=>{return}}
                            clickDownload={()=>{return}}
                            clickEdit={()=>{return}}
                            clickDelete={()=>{return}}
                            classEditBtn="mr-1 hover:text-white"
                            classDownloadBtn="mr-1 hover:text-white bg-color-default-old"
                            classSendIcon="mr-1 hover:text-white bg-orange-young border-orange-young hover:border-orange-young"
                            classDeleteBtn="bg-pink border-pink hover:border-pink-old hover:bg-pink-old hover:text-white"
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

                    {/* form confirm patient to counter */}
                    {!drugCounterPatient?.id && (
                        <FormConfirmation/>
                    )}
                </Container>
            )}
        </>
    )
}