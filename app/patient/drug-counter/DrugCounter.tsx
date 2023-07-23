'use client'

import { TitleInput } from "components/input/TitleInput";
import { UseCounter } from "./UseCounter";
import { InputSelect } from "components/input/InputSelect";
import { TotalPatient } from "./TotalPatient";
import { CardInfo } from "components/dataInformation/CardInfo";
import Button from "components/Button";
import ErrorInput from "components/input/ErrorInput";
import { QRScanner } from "./QRScanner";

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
    } = UseCounter()

    return (
        <>
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
                    width: '250px'
                }}
                >
                    <TitleInput
                        title="QR Scanner"
                    />
                    {viewScanner && (
                        <QRScanner/>
                    )}
                    <Button
                        nameBtn={viewScanner ? 'Off Scanner' : 'On Scanner'}
                        classBtn="hover:bg-white mt-8 w-full"
                        classLoading="hidden"
                        clickBtn={onScanner}
                    />
                </CardInfo>
            </div>
        </>
    )
}