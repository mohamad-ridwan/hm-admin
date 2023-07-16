'use client'

import { TitleInput } from "components/input/TitleInput";
import { UseCounter } from "./UseCounter";
import { InputSelect } from "components/input/InputSelect";
import { TotalPatient } from "./TotalPatient";

export function DrugCounter() {
    const {
        optionsCounter,
        optionsGoTo,
        optionsTotalPatient
    } = UseCounter()

    return (
        <>
            <h1
                className="font-bold text-[1.3rem] mb-8"
            >Counter Information</h1>

            <TitleInput
                title="Choose Counter"
            />
            <InputSelect
                data={optionsCounter}
                classWrapp="w-fit"
            />

            <TotalPatient data={optionsTotalPatient} />

            <TitleInput
                title="Choose to go to the page"
            />
            <InputSelect
                data={optionsGoTo}
                classWrapp="w-fit"
            />
        </>
    )
}