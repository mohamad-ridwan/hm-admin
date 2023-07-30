'use client'

import { useState } from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCalendarDays, faClock, faUserCheck, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import ServicingHours from "lib/dataInformation/ServicingHours"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { createHourFormat } from "lib/formats/createHourFormat"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"
import { UsePersonalFT } from "./UsePersonalFT"
import { UseFinishTreatment } from "app/patient/finished-treatment/UseFinishTreatment"
import { EditFinishTreatment } from "app/patient/finished-treatment/EditFinishTreatment"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"

export function FinishedTreatment({ params }: { params: string }) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)
    const {
        detailDataPatientRegis,
        dataPatientFinishTreatment,
    } = UsePatientData({ params })

    const {
        dataAdmin
    } = ServicingHours()

    const {
        isActiveMenu,
        clickMenu
    } = UsePersonalFT()

    const {
        onPopupEditFinishTreatment,
        clickClosePopupEditFT,
        changeEditFT,
        patientNameEditFT,
        errInputEditFinishTreatment,
        inputEditFinishTreatment,
        changeDateEditFT,
        handleSelectEditFT,
        optionsAdminEmail,
        isPatientCanceled,
        submitEditFinishTreatment,
        loadingIdSubmitEditFT,
        idPatientEditFT,
        clickEditFinishTreatment,
        setOnPopupEditFinishTreatment,
        clickDeleteFT,
        loadingIdDeleteFT
    } = UseFinishTreatment({ setOnModalSettings })

    const confirmHours = new Date(`${dataPatientFinishTreatment?.confirmedTime?.dateConfirm} ${dataPatientFinishTreatment?.confirmedTime?.confirmHour}`)
    const findAdmin = dataAdmin?.find(admin => admin?.id === dataPatientFinishTreatment?.adminInfo?.adminId)

    const detailData: {
        title: string
        textInfo: string
        icon?: IconDefinition
    }[] = dataPatientFinishTreatment?.id ?
            [
                {
                    title: 'Confirmed Date',
                    textInfo: createDateNormalFormat(dataPatientFinishTreatment.confirmedTime.dateConfirm),
                    icon: faCalendarDays
                },
                {
                    title: 'Confirmed Hours',
                    textInfo: createHourFormat(confirmHours),
                    icon: faClock
                },
                {
                    title: 'Treatment Status',
                    textInfo: dataPatientFinishTreatment.isCanceled ? 'Canceled' : 'Completed',
                    icon: dataPatientFinishTreatment.isCanceled ? faUserXmark : faUserCheck
                },
                {
                    title: 'Message Cancelled',
                    textInfo: dataPatientFinishTreatment.messageCancelled,
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

    const findIdLoadingDelete = loadingIdDeleteFT.find(id=> id === params[4])

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Edit',
            classWrapp: 'cursor-pointer',
            click: () => {
                clickEditFinishTreatment(params[4], detailDataPatientRegis?.patientName)
                setOnPopupEditFinishTreatment(true)
                clickMenu()
            }
        },
        {
            name: 'Delete',
            classWrapp: findIdLoadingDelete ? 'text-not-allowed hover:bg-white hover:text-not-allowed cursor-not-allowed' : 'cursor-pointer text-red-default',
            click: ()=>{
                if(!findIdLoadingDelete){
                    clickDeleteFT(params[4], detailDataPatientRegis?.patientName)
                    clickMenu()
                }
            }
        }
    ]

    return (
        <>
            {dataPatientFinishTreatment?.id && (
                <Container
                    isNavleft={false}
                    title="Treatment Finished"
                    classHeadDesc="text-3xl font-semibold flex-col"
                >
                    <Container
                        isNavleft={false}
                        classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
                        maxWidth="auto"
                    >
                        {onPopupEditFinishTreatment && (
                            <EditFinishTreatment
                                clickClosePopupEditFT={clickClosePopupEditFT}
                                changeEditFT={changeEditFT}
                                patientName={patientNameEditFT}
                                errInputEditFinishTreatment={errInputEditFinishTreatment}
                                inputEditFinishTreatment={inputEditFinishTreatment}
                                changeDateEditFT={changeDateEditFT}
                                handleSelectEditFT={handleSelectEditFT}
                                optionsAdminEmail={optionsAdminEmail}
                                isPatientCanceled={isPatientCanceled}
                                loadingIdSubmitEditFT={loadingIdSubmitEditFT}
                                idPatientEditFT={idPatientEditFT}
                                submitEditFinishTreatment={submitEditFinishTreatment}
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
                            titleInfo="Information"
                            actionsData={actionsMenu}
                            classWrappMenu={`${isActiveMenu ? 'flex' : 'hidden'} right-9`}
                            clickMenu={clickMenu}
                            styleHeadTop={{
                                display: 'none'
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
                </Container>
            )}
        </>
    )
}