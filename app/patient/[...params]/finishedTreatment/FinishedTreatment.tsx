'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faCalendarDays, faClock, faUserCheck, faUserXmark } from "@fortawesome/free-solid-svg-icons"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import ServicingHours from "lib/actions/ServicingHours"
import { UsePatientData } from "lib/actions/dataInformation/UsePatientData"
import { createDateNormalFormat } from "lib/dates/createDateNormalFormat"
import { createHourFormat } from "lib/dates/createHourFormat"

export function FinishedTreatment({ params }: { params: string }) {
    const {
        dataPatientFinishTreatment,
    } = UsePatientData({ params })

    const {
        dataAdmin
    } = ServicingHours()

    const confirmHours = new Date(`${dataPatientFinishTreatment?.confirmedTime?.dateConfirm} ${dataPatientFinishTreatment?.confirmedTime?.confirmHour}`)
    const findAdmin = dataAdmin?.find(admin=>admin?.id === dataPatientFinishTreatment?.adminInfo?.adminId)

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
                        <HeadInfo
                            titleInfo="Information"
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