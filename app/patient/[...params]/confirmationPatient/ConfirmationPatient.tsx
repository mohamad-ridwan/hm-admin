'use client'

import { IconDefinition, faCalendarDays, faCheck, faClock, faListOl, faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Container } from "components/Container";
import { CardInfo } from "components/dataInformation/CardInfo";
import { HeadInfo } from "components/dataInformation/HeadInfo";
import ServicingHours from "lib/dataInformation/ServicingHours";
import { UsePatientData } from "lib/dataInformation/UsePatientData";
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat";
import { FormConfirmation } from "./FormConfirmation";
import { UseForm } from "./UseConfirmation";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";
import Button from "components/Button";
import { ActionsDataT } from "lib/types/TableT.type";
import EditPatientConfirmation from "app/patient/confirmation-patient/EditPatientConfirmation";
import FormPatientConfirmation from "app/patient/confirmation-patient/FormPatientConfirmation";

export function ConfirmationPatient({ params }: { params: string }) {
    const {
        detailDataPatientRegis,
        dataConfirmPatient,
        drugCounterPatient,
        dataPatientFinishTreatment,
        doctors,
        dataRooms,
    } = UsePatientData({ params })

    const {
        loadGetDataAdmin,
        dataAdmin
    } = ServicingHours()

    const {
        clickDownload,
        clickSend,
        loadingSendEmail,
        clickMenu,
        isMenuActive,
        clickDelete,
        loadingDelete,
        setOnModalSettings,
        onModalSettings,
        doctorIsAvailable
    } = UseForm({params})

    const {
        onPopupEditConfirmPatient,
        clickEditToConfirmPatient,
        valueInputEditConfirmPatient,
        nameEditConfirmPatient,
        errEditInputConfirmPatient,
        closePopupEditConfirmPatient,
        changeEditConfirmPatient,
        selectEmailAdmin,
        handleInputSelectConfirmPatient,
        changeDateConfirm,
        selectDoctorSpecialist,
        loadDataDoctor,
        loadDataRoom,
        selectDoctor,
        selectRoom,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        idPatientToEditConfirmPatient,
        submitEditConfirmPatient,
        clickOnEditConfirmPatient,
        idLoadingEditConfirmPatient,
        disableToggleQueue
    } = FormPatientConfirmation({ setOnModalSettings })

    const findCurrentRoom = dataRooms?.find(room => room.id === dataConfirmPatient?.roomInfo?.roomId)
    const findCurrentDoctor = doctors?.find(doctor => doctor.id === dataConfirmPatient?.doctorInfo?.doctorId)

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
                clickEditToConfirmPatient(detailDataPatientRegis.id, detailDataPatientRegis.patientName)
                clickOnEditConfirmPatient()
                clickMenu()
            }
        },
        {
            name: 'Download PDF',
            classWrapp: 'cursor-pointer',
            click: () => clickDownload()
        },
        {
            name: 'Send Confirmation',
            classWrapp: loadingSendEmail ? 'text-not-allowed hover:text-not-allowed hover:bg-white cursor-not-allowed' : 'cursor-pointer',
            click: () => clickSend()
        },
        {
            name: 'Delete',
            classWrapp: loadingDelete || dataPatientFinishTreatment?.id || params.length > 5 ? 'text-not-allowed hover:bg-white cursor-not-allowed hover:text-[#8f8f8f]' : 'text-red-default cursor-pointer',
            click: () => {
                if (dataPatientFinishTreatment?.id || drugCounterPatient?.id) {
                    return
                }
                if(params.length <= 5){
                    clickDelete(detailDataPatientRegis.patientName, detailDataPatientRegis.id, dataConfirmPatient.id)
                }
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
                        {onPopupEditConfirmPatient && (
                            <EditPatientConfirmation
                                valueInputEditConfirmPatient={valueInputEditConfirmPatient}
                                nameEditConfirmPatient={nameEditConfirmPatient}
                                errEditInputConfirmPatient={errEditInputConfirmPatient}
                                closePopupEditConfirmPatient={closePopupEditConfirmPatient}
                                changeEditConfirmPatient={changeEditConfirmPatient}
                                selectEmailAdmin={selectEmailAdmin}
                                handleInputSelectConfirmPatient={handleInputSelectConfirmPatient}
                                changeDateConfirm={changeDateConfirm}
                                selectDoctorSpecialist={selectDoctorSpecialist}
                                loadDataDoctor={loadDataDoctor}
                                loadDataRoom={loadDataRoom}
                                selectDoctor={selectDoctor}
                                selectRoom={selectRoom}
                                editActiveManualQueue={editActiveManualQueue}
                                toggleChangeManualQueue={toggleChangeManualQueue}
                                toggleSetAutoQueue={toggleSetAutoQueue}
                                idPatientToEditConfirmPatient={idPatientToEditConfirmPatient}
                                idLoadingEditConfirmPatient={idLoadingEditConfirmPatient}
                                submitEditConfirmPatient={submitEditConfirmPatient}
                                disableToggleQueue={disableToggleQueue}
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
                                display: drugCounterPatient?.id || dataPatientFinishTreatment?.id ? 'none' : 'flex',
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
                    {
                    !drugCounterPatient?.id &&
                    !dataPatientFinishTreatment?.id &&
                    (
                        <FormConfirmation 
                        params={params}
                        />
                    )}
                </Container>
            )}
        </>
    )
}