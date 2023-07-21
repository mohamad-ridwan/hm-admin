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
import { UseForm } from "./UseForm";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";
import Button from "components/Button";
import { ActionsDataT } from "lib/types/TableT.type";

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

    const {
        onPopupSetting,
        clickDownload,
        cancelPopupFormConfirm,
        confirmForDownloadPdf,
        clickSend,
        confirmSendEmail,
        loadingSendEmail,
        clickMenu,
        isMenuActive
    } = UseForm()

    const findCurrentRoom = dataRooms?.find(room => room.id === dataConfirmPatient?.roomInfo?.roomId)
    const findCurrentDoctor = doctors?.find(doctor => doctor.id === dataConfirmPatient?.doctorInfo?.doctorId)

    const getAppointmentDate = createDateNormalFormat(detailDataPatientRegis?.appointmentDate)
    const dayOfAppointment = getAppointmentDate?.split(',')[1]?.replace(spaceString, '')
    const dateOfAppointment = getAppointmentDate?.split(',')[0]
    const doctorIsHoliday = findCurrentDoctor?.holidaySchedule?.find(date => date.date === createDateFormat(dateOfAppointment))
    const doctorIsOnCurrentDay = findCurrentDoctor?.doctorSchedule?.find(day => day.dayName.toLowerCase() === dayOfAppointment?.toLowerCase())
    const doctorIsAvailable = !doctorIsHoliday ? doctorIsOnCurrentDay ? true : false : false

    const findAdmin = !loadGetDataAdmin && typeof dataAdmin !== 'undefined' ? dataAdmin.find(admin => admin.id === dataConfirmPatient?.adminInfo?.adminId) : null

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

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Edit',
            classWrapp: 'cursor-pointer',
            click: () => {
                return
            }
        },
        {
            name: 'Download PDF',
            classWrapp: 'cursor-pointer',
            click: ()=>clickDownload()
        },
        {
            name: 'Send Confirmation',
            classWrapp: loadingSendEmail ? 'text-not-allowed hover:text-not-allowed hover:bg-white cursor-not-allowed' :  'cursor-pointer',
            click: ()=>clickSend()
        },
        {
            name: 'Delete',
            classWrapp: 'text-red-default cursor-pointer',
            click: ()=>{
                return
            }
        }
    ]

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
                        {onPopupSetting?.title && (
                            <ContainerPopup
                                className='flex justify-center items-center overflow-y-auto'
                            >
                                <SettingPopup
                                    clickClose={cancelPopupFormConfirm}
                                    title={onPopupSetting.title}
                                    classIcon='text-font-color-2'
                                    iconPopup={onPopupSetting.iconPopup}
                                >
                                    <Button
                                        nameBtn={onPopupSetting.nameBtnNext}
                                        classBtn="hover:bg-white"
                                        classLoading="hidden"
                                        styleBtn={{
                                            padding: '0.5rem',
                                            marginRight: '0.6rem',
                                            marginTop: '0.5rem'
                                        }}
                                        clickBtn={() => {
                                            if (onPopupSetting.categoryAction === 'download-pdf') {
                                                confirmForDownloadPdf()
                                            } else if (onPopupSetting.categoryAction === 'send-email') {
                                                confirmSendEmail()
                                            }
                                        }}
                                    />

                                    <Button
                                        nameBtn="Cancel"
                                        classBtn="bg-white border-none"
                                        classLoading="hidden"
                                        styleBtn={{
                                            padding: '0.5rem',
                                            marginTop: '0.5rem',
                                            color: '#495057'
                                        }}
                                        clickBtn={cancelPopupFormConfirm}
                                    />
                                </SettingPopup>
                            </ContainerPopup>
                        )}

                        <HeadInfo
                            title={dataConfirmPatient?.roomInfo?.queueNumber}
                            titleInfo="Confirmation Data Information"
                            icon={faListOl}
                            iconRight={doctorIsAvailable ? faCheck : faTriangleExclamation}
                            titleRight={doctorIsAvailable ? 'Doctor available' : 'Doctor is not available'}
                            // deleteIcon={faTrash}
                            // editIcon={faPencil}
                            // downloadIcon={faDownload}
                            // sendIcon={loadingSendEmail ? undefined : faPaperPlane}
                            // clickSend={clickSend}
                            // clickDownload={clickDownload}
                            // clickEdit={() => { return }}
                            // clickDelete={() => { return }}
                            // classEditBtn="mr-1 hover:text-white"
                            // classDownloadBtn="mr-1 hover:text-white bg-color-default-old"
                            // classSendIcon={`${loadingSendEmail ? 'cursor-not-allowed' : 'cursor-pointer'} mr-1 hover:text-white bg-orange-young border-orange-young hover:border-orange-young`}
                            // classLoadingSend={loadingSendEmail ? 'flex' : 'hidden'}
                            // classDeleteBtn="bg-pink border-pink hover:border-pink-old hover:bg-pink-old hover:text-white"
                            styleHeadTop={{
                                justifyContent: 'space-between'
                            }}
                            styleHeadRight={{
                                color: doctorIsAvailable ? '#288bbc' : '#ff296d'
                            }}
                            actionsData={actionsMenu}
                            classWrappMenu={`${isMenuActive ? 'flex' : 'hidden'} right-9`}
                            clickMenu={clickMenu}
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
                        <FormConfirmation />
                    )}
                </Container>
            )}
        </>
    )
}