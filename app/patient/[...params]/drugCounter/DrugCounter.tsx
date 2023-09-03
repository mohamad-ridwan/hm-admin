'use client'

import { useState } from "react"
import { IconDefinition, faCalendarDays, faCircleCheck, faCircleExclamation, faClock, faListOl } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { UsePatientData } from "lib/dataInformation/UsePatientData"
import { createDateFormat } from "lib/formats/createDateFormat"
import { createDateNormalFormat } from "lib/formats/createDateNormalFormat"
import { CounterForm } from "./CounterForm"
import { UseForm } from "./UseForm"
import { ActionsDataT, PopupSettings } from "lib/types/TableT.type"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"
import { ConfirmInfo } from "./ConfirmInfo"
import { RenderTextHTML } from "lib/pdf/RenderTextHTML"
import { EditPatientCounter } from "app/patient/drug-counter/[counterName]/[status]/EditPatientCounter"
import { UseDrugCounter } from "app/patient/drug-counter/[counterName]/[status]/UseDrugCounter"

export function DrugCounter({ params }: { params: string }) {
    const [onModalSettings, setOnModalSettings] = useState<PopupSettings>({} as PopupSettings)

    const {
        detailDataPatientRegis,
        drugCounterPatient,
        dataPatientFinishTreatment,
        dataLoket
    } = UsePatientData({ params })

    const {
        clickMenu,
        isActiveMenu,
        clickDownloadPdf,
        setIsActiveMenu,
        clickDelete,
        loadingDelete
    } = UseForm({ params, setOnModalSettings })

    const {
        closePopupEditPatientC,
        onPopupEditPatientCounter,
        changeEditPatientC,
        handleSelectCounter,
        handleChangeDate,
        inputValueEditPatientC,
        errInputValueEditPatientC,
        selectCounter,
        selectEmailAdmin,
        setValue,
        value,
        submitEditPatientCounter,
        idToEditPatientCounter,
        loadingIdSubmitEditPatientC,
        editActiveManualQueue,
        toggleChangeManualQueue,
        toggleSetAutoQueue,
        disableUpdtQueue,
        nameEditPatientCounter,
        clickEditPatientCounter,
        setOnpopupEditPatientCounter
    } = UseDrugCounter({ params: { counterName: '-', status: '-' }, setOnModalSettings, onModalSettings })

    const loketName = dataLoket?.find(loket => loket.id === drugCounterPatient?.loketInfo?.loketId)

    const title = drugCounterPatient?.isConfirm?.confirmState ? 'Confirmed' : 'Not yet confirmed'
    const icon = drugCounterPatient?.isConfirm?.confirmState ? faCircleCheck : faCircleExclamation
    const classTitle = drugCounterPatient?.isConfirm?.confirmState ? '' : 'text-orange-young'
    const titleRight = drugCounterPatient?.queueNumber
    const iconRight = faListOl

    const status =
        drugCounterPatient?.isConfirm?.confirmState === false && dataPatientFinishTreatment?.id ?
            'CANCELED' :
            drugCounterPatient?.isConfirm?.confirmState === false && drugCounterPatient?.submissionDate?.submissionDate === createDateFormat(new Date()) ?
                'WAITING' : drugCounterPatient?.isConfirm?.confirmState ? 'ALREADY CONFIRMED' :
                    drugCounterPatient?.isConfirm?.confirmState === false && drugCounterPatient?.submissionDate?.submissionDate < createDateFormat(new Date()) ?
                        'EXPIRED' :
                        'NULL'

    const detailData: {
        title: string
        textInfo: string | JSX.Element
        icon?: IconDefinition
        width?: string
    }[] = drugCounterPatient?.id ?
            [
                {
                    title: `Doctor's Prescription`,
                    textInfo: <RenderTextHTML textInfo={drugCounterPatient.message} />,
                    width: '100%'
                },
                {
                    title: 'Queue Number',
                    textInfo: drugCounterPatient.queueNumber,
                    icon: faListOl
                },
                {
                    title: 'Hours Submitted',
                    textInfo: drugCounterPatient.submissionDate.submitHours,
                    icon: faClock
                },
                {
                    title: 'Submission Date',
                    textInfo: createDateNormalFormat(drugCounterPatient.submissionDate.submissionDate),
                    icon: faCalendarDays
                },
            ] : []

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Edit',
            classWrapp: 'cursor-pointer',
            click: () => {
                clickEditPatientCounter(drugCounterPatient?.patientId, detailDataPatientRegis?.patientName)
                setOnpopupEditPatientCounter(true)
                setIsActiveMenu(false)
            }
        },
        {
            name: 'Queue Number PDF',
            classWrapp: 'cursor-pointer',
            click: () => clickDownloadPdf()
        },
        {
            name: 'Delete',
            classWrapp: loadingDelete || dataPatientFinishTreatment?.id ? 'text-not-allowed hover:text-[#8f8f8f] hover:bg-white cursor-not-allowed' : 'text-red-default cursor-pointer',
            click: () => {
                if(!dataPatientFinishTreatment?.id){
                    clickDelete()
                }
            }
        },
    ]

    return (
        <>
            {drugCounterPatient?.id && (
                <Container
                    isNavleft={false}
                    title="At Counter"
                    desc={loketName?.loketName}
                    classHeadDesc="text-3xl font-semibold flex-col"
                    wrappId="counterInfo"
                >
                    <Container
                        isNavleft={false}
                        classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
                        maxWidth="auto"
                    >
                        {onPopupEditPatientCounter && (
                            <EditPatientCounter
                                namePatient={nameEditPatientCounter}
                                closePopupEditPatientC={closePopupEditPatientC}
                                changeEditPatientC={changeEditPatientC}
                                inputValueEditPatientC={inputValueEditPatientC}
                                errInputValueEditPatientC={errInputValueEditPatientC}
                                selectCounter={selectCounter}
                                selectEmailAdmin={selectEmailAdmin}
                                handleSelectCounter={handleSelectCounter}
                                setValue={setValue}
                                value={value}
                                handleChangeDate={handleChangeDate}
                                submitEditPatientCounter={submitEditPatientCounter}
                                idToEditPatientCounter={idToEditPatientCounter}
                                loadingIdSubmitEditPatientC={loadingIdSubmitEditPatientC}
                                editActiveManualQueue={editActiveManualQueue}
                                toggleChangeManualQueue={toggleChangeManualQueue}
                                toggleSetAutoQueue={toggleSetAutoQueue}
                                disableUpdtQueue={disableUpdtQueue}
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
                            title={title}
                            titleRight={titleRight}
                            titleInfo="Information Counter"
                            icon={icon}
                            iconRight={iconRight}
                            classTitle={classTitle}
                            styleHeadTop={{
                                justifyContent: 'space-between'
                            }}
                            styleHeadRight={{
                                color: '#288bbc'
                            }}
                            actionsData={actionsMenu}
                            clickMenu={clickMenu}
                            classWrappMenu={`${isActiveMenu ? 'flex' : 'hidden'} right-9`}
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
                            {
                                drugCounterPatient?.submissionDate?.submissionDate === createDateFormat(new Date()) ?
                                    (
                                        <CardInfo
                                            title="Status (Today)"
                                            textInfo={status}
                                            icon={faClock}
                                        />
                                    ) :
                                    drugCounterPatient?.isConfirm?.confirmState === false &&
                                    !dataPatientFinishTreatment?.id &&
                                    drugCounterPatient?.submissionDate?.submissionDate < createDateFormat(new Date()) && (
                                        <CardInfo
                                            title="Status (Today)"
                                            textInfo={status}
                                            icon={faClock}
                                        />
                                    )
                            }
                        </div>
                    </Container>

                    {!dataPatientFinishTreatment?.id && (
                        <CounterForm params={params} />
                    )}
                    {drugCounterPatient?.isConfirm?.confirmState && (
                        <ConfirmInfo params={params} />
                    )}
                </Container>
            )}
        </>
    )
}