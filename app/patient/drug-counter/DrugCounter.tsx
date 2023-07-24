'use client'

import { TitleInput } from "components/input/TitleInput";
import { UseCounter } from "./UseCounter";
import { InputSelect } from "components/input/InputSelect";
import { TotalPatient } from "./TotalPatient";
import { CardInfo } from "components/dataInformation/CardInfo";
import Button from "components/Button";
import ErrorInput from "components/input/ErrorInput";
import { QRScanner } from "./QRScanner";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";

export function DrugCounter() {
    const {
        optionsCounter,
        optionsGoTo,
        optionsTotalPatient,
        handleCounter,
        handleGoTo,
        errSelectToPage,
        clickViewPage,
        viewScanner,
        onScanner,
        clickPassPatient,
        onPopupSetting,
        cancelPopup,
        confirmPassPatient,
        currentPatientCall,
        loadingPassPatient
    } = UseCounter()

    function OffDisplayScan() {
        return <div
            className="h-[250px] max-w-[250px] bg-[#f1f1f1]"
        >

        </div>
    }

    return (
        <>
            {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={cancelPopup}
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
                                if (onPopupSetting.categoryAction === 'pass-patient') {
                                    confirmPassPatient()
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
                            clickBtn={cancelPopup}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            <h1
                className="font-bold text-[1.3rem] mb-8"
            >Counter Information</h1>

            <div
                className="flex flex-wrap justify-between"
            >
                <CardInfo>
                    <TitleInput
                        title="Choose Counter"
                    />
                    <InputSelect
                        id="counter"
                        data={optionsCounter}
                        classWrapp="w-full"
                        handleSelect={handleCounter}
                    />
                    <ErrorInput
                        error={errSelectToPage?.counter}
                    />

                    <TotalPatient data={optionsTotalPatient} />
                </CardInfo>

                <CardInfo>
                    <TitleInput
                        title="Choose to go to the page"
                    />
                    <InputSelect
                        id="goToPage"
                        data={optionsGoTo}
                        classWrapp="w-full"
                        handleSelect={handleGoTo}
                    />
                    <ErrorInput
                        error={errSelectToPage?.toPage}
                    />
                    <Button
                        nameBtn='View page'
                        classBtn="hover:bg-white mt-8"
                        classLoading="hidden"
                        clickBtn={clickViewPage}
                    />
                </CardInfo>

                <CardInfo
                    styleWrapp={{
                        width: '250px',
                    }}
                >
                    <TitleInput
                        title="QR Scanner"
                    />
                    {viewScanner ? (
                        <QRScanner />
                    ) : (
                        <OffDisplayScan />
                    )}
                    <Button
                        nameBtn={viewScanner ? 'Off Scanner' : 'On Scanner'}
                        classBtn="hover:bg-white mt-8 w-full"
                        classLoading="hidden"
                        clickBtn={onScanner}
                    />
                </CardInfo>

                <CardInfo>
                    <TitleInput
                        title="Current Queue Number"
                    />

                    <h1
                        className="font-bold text-[6rem]"
                    >{currentPatientCall.queueNumber}</h1>

                    {currentPatientCall.patientId && (
                        <Button
                            nameBtn="Pass Patient"
                            classBtn={`${loadingPassPatient ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'} mt-8`}
                            classLoading={loadingPassPatient ? 'flex' : 'hidden'}
                            clickBtn={clickPassPatient}
                        />
                    )}
                </CardInfo>
            </div>
        </>
    )
}