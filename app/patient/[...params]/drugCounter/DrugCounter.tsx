'use client'

import { IconDefinition, faCalendarDays, faCircleCheck, faCircleExclamation, faClock, faListOl } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { createDateFormat } from "lib/dates/createDateFormat"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { CounterForm } from "./CounterForm"
import { UseForm } from "./UseForm"
import { ActionsDataT } from "lib/types/TableT.type"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import Button from "components/Button"

export function DrugCounter({ params }: { params: string }) {
    const {
        drugCounterPatient,
        dataPatientFinishTreatment,
        dataLoket
    } = UsePatientData({ params })

    const {
        clickMenu,
        isActiveMenu,
        clickDownloadPdf,
        onPopupSetting,
        cancelPopupSetting,
        confirmDownloadPdf
    } = UseForm({ params })

    const loketName = dataLoket?.find(loket => loket.id === drugCounterPatient?.loketInfo?.loketId)

    const title = drugCounterPatient?.isConfirm?.confirmState ? 'Confirmed' : 'Not yet confirmed'
    const icon = drugCounterPatient?.isConfirm?.confirmState ? faCircleCheck : faCircleExclamation
    const classTitle = drugCounterPatient?.isConfirm?.confirmState ? '' : 'text-orange-young'
    const titleRight = drugCounterPatient?.queueNumber
    const iconRight = faListOl

    function RenderTextHTML({ textInfo }: { textInfo: string }) {
        const checkList = textInfo?.replace('<ol', '<ol class="list-decimal list-inside"')

        return <div
            dangerouslySetInnerHTML={{ __html: checkList }}
        ></div>
    }

    const status = drugCounterPatient?.isConfirm?.confirmState === false && drugCounterPatient?.submissionDate?.submissionDate === createDateFormat(new Date()) ? 'WAITING' : drugCounterPatient?.isConfirm?.confirmState ? 'ALREADY CONFIRMED' : drugCounterPatient?.isConfirm?.confirmState === false && drugCounterPatient?.submissionDate?.submissionDate < createDateFormat(new Date()) ? 'EXPIRED' : 'NULL'

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
                    title: 'Status',
                    textInfo: status,
                    icon: faClock
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
            name: 'Download PDF',
            classWrapp: 'cursor-pointer',
            click: () => clickDownloadPdf()
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
                                            if (onPopupSetting.categoryAction === 'download-pdf') {
                                                confirmDownloadPdf()
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
                        </div>
                    </Container>

                    {!dataPatientFinishTreatment?.id && (
                        <CounterForm params={params} />
                    )}
                </Container>
            )}
        </>
    )
}