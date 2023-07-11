'use client'

import { CSSProperties, ChangeEvent, useState } from "react";
import ErrorInput from "components/input/ErrorInput";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { DoctorScheduleT } from "lib/types/DoctorsT.types";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";
import Button from "components/Button";

type ActionProps = {
    onAddDoctorSchedule: () => void
    submitAddDoctorSchedule: () => void
    changeInputAddDocSchedule: (e: ChangeEvent<HTMLInputElement>)=>void
    selectDayAddDoctorSchedule: ()=>void
}

type Props = ActionProps & {
    inputAddDoctorSchedule: DoctorScheduleT
    errInputAddDoctorSchedule: DoctorScheduleT
}

export function AddDoctorSchedule({
    onAddDoctorSchedule,
    inputAddDoctorSchedule,
    errInputAddDoctorSchedule,
    submitAddDoctorSchedule,
    changeInputAddDocSchedule,
    selectDayAddDoctorSchedule,
}: Props) {
    const [dayNames] = useState<DataOptionT>([
        {
            id: 'Select Day',
            title: 'Select Day'
        },
        {
            id: 'Senin',
            title: 'Senin'
        },
        {
            id: 'Selasa',
            title: 'Selasa'
        },
        {
            id: 'Rabu',
            title: 'Rabu'
        },
        {
            id: 'Kamis',
            title: 'Kamis'
        },
        {
            id: 'Jumat',
            title: 'Jumat'
        },
        {
            id: 'Sabtu',
            title: 'Sabtu'
        },
        {
            id: 'Minggu',
            title: 'Minggu'
        },
    ])

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={onAddDoctorSchedule}
                title="Add Doctor schedule"
            >
                <TitleInput title='Doctor schedule ID' />
                <Input
                    type='text'
                    nameInput='id'
                    valueInput={inputAddDoctorSchedule.id}
                    readonly
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctorSchedule?.id}
                />

                <TitleInput title='Name Day' />
                <InputSelect
                    data={dayNames}
                    id="selectDay"
                    handleSelect={selectDayAddDoctorSchedule}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctorSchedule?.dayName}
                />

                <TitleInput title='Practice Hours' />
                <Input
                    type='text'
                    nameInput='practiceHours'
                    placeholder="08:00 - 12:00"
                    valueInput={inputAddDoctorSchedule.practiceHours}
                    changeInput={changeInputAddDocSchedule}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctorSchedule?.practiceHours}
                />

                <Button
                    nameBtn='Add'
                    classLoading="hidden"
                    classBtn="hover:bg-white"
                    clickBtn={submitAddDoctorSchedule}
                />
            </FormPopup>
        </ContainerPopup>
    )
}