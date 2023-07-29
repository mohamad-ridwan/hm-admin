'use client'

import { useState } from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCalendarDays, faClock } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { currencyFormat } from "lib/formats/currencyFormat"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { RenderTextHTML } from "lib/pdf/RenderTextHTML"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"
import { UseForm } from "./UseForm"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { EditConfirmCounterP } from "./EditConfirmCounterP"

export function ConfirmInfo({ params }: { params: string }) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    const {
        detailDataPatientRegis,
        drugCounterPatient,
    } = UsePatientData({ params })

    const {
        clickTreatmentResultPDF,
        clickMenu,
        isActiveMenu,
        onPopupSetting,
        cancelPopupSetting,
        confirmDownloadTRPdf,
        clickEditCounterConfirmP,
        inputValueEditCounterConfirmP,
        namePatientEditCounterConfP,
        onPopupEditCounterConfirmP,
        closePopupEditConfirmPatientC,
        errInputEditCounterConfirmP,
        handleChangeDate,
        changeEditConfirmPatientC,
        handleSelectCounterConfirmP,
        optionsAdminEmailEditCounterConfP,
        setValueMsgEditCounterConfP,
        valueMsgEditCounterConfP,
        paymentOptions,
        submitEditCounterConfirmP,
        loadingIdSubmitEditCounterConfirmP,
        idEditCounterConfirmP
    } = UseForm({ params, setOnModalSettings })

    const checkPaymentMethod: 'BPJS' | 'cash' = drugCounterPatient?.id &&
        drugCounterPatient?.isConfirm?.paymentInfo?.paymentMethod === 'BPJS' ? 'BPJS' : 'cash'
    const totalCost: string = checkPaymentMethod === 'cash' ? currencyFormat(Number(drugCounterPatient?.isConfirm?.paymentInfo?.totalCost), 'id-ID', 'IDR') : '-'

    const detailData: {
        title: string
        textInfo: string | JSX.Element
        icon?: IconDefinition
        width?: string
    }[] = drugCounterPatient?.id ?
            [
                {
                    title: 'Message',
                    textInfo: <RenderTextHTML textInfo={drugCounterPatient.isConfirm.paymentInfo?.message as string} />,
                    width: '100%'
                },
                {
                    title: 'Payment Method',
                    textInfo: drugCounterPatient.isConfirm.paymentInfo.paymentMethod,
                },
                {
                    title: 'Total Cost',
                    textInfo: totalCost,
                },
                {
                    title: 'Confirmation hour',
                    textInfo: drugCounterPatient.isConfirm.dateConfirm.confirmHour,
                    icon: faClock
                },
                {
                    title: 'Confirmed Date',
                    textInfo: createDateNormalFormat(drugCounterPatient.isConfirm.dateConfirm.dateConfirm),
                    icon: faCalendarDays
                },
            ]
            : []

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Edit Confirmation',
            classWrapp: 'cursor-pointer',
            click: () => {
                clickEditCounterConfirmP(detailDataPatientRegis?.id, detailDataPatientRegis?.patientName)
                clickMenu()
            }
        },
        {
            name: 'Treatment Result PDF',
            classWrapp: 'cursor-pointer',
            click: () => clickTreatmentResultPDF()
        },
    ]

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            {onPopupEditCounterConfirmP && (
                <EditConfirmCounterP
                closePopupEditConfirmPatientC={closePopupEditConfirmPatientC}
                namePatient={namePatientEditCounterConfP as string}
                inputValueEditCounterConfirmP={inputValueEditCounterConfirmP}
                errInputEditCounterConfirmP={errInputEditCounterConfirmP}
                handleChangeDate={handleChangeDate}
                changeEditConfirmPatientC={changeEditConfirmPatientC}
                handleSelectCounterConfirmP={handleSelectCounterConfirmP}
                optionsAdminEmailEditCounterConfP={optionsAdminEmailEditCounterConfP}
                setValueMsgEditCounterConfP={setValueMsgEditCounterConfP}
                valueMsgEditCounterConfP={valueMsgEditCounterConfP}
                paymentOptions={paymentOptions}
                submitEditCounterConfirmP={submitEditCounterConfirmP}
                loadingIdSubmitEditCounterConfirmP={loadingIdSubmitEditCounterConfirmP}
                idEditCounterConfirmP={idEditCounterConfirmP}
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
            {/* {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={cancelPopupSetting}
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
                                if (onPopupSetting.categoryAction === 'download-treatment-result-pdf') {
                                    confirmDownloadTRPdf()
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
                            clickBtn={cancelPopupSetting}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )} */}

            <HeadInfo
                titleInfo="Confirmation Data Information"
                actionsData={actionsMenu}
                clickMenu={clickMenu}
                classWrappMenu={`${isActiveMenu ? 'flex' : 'hidden'} right-9`}
                styleHeadTop={{ display: 'none' }}
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
                            styleWrapp={{
                                width: `${item?.width}`
                            }}
                        />
                    )
                })}
            </div>
        </Container>
    )
}