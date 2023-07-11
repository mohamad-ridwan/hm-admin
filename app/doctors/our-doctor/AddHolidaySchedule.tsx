import { CSSProperties, ChangeEvent } from "react";
import ErrorInput from "components/input/ErrorInput";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { HolidaySchedule } from "lib/types/DoctorsT.types";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/dates/renderCustomHeader";
import Button from "components/Button";

type ActionProps = {
    onAddHolidaySchedule: () => void
    selectHolidayDate: (e?: Date | ChangeEvent<HTMLInputElement>) => void
    submitAddHolidaySchedule: ()=>void
}

type Props = ActionProps & {
    inputAddHolidaySchedule: HolidaySchedule
    errInputAddHolidaySchedule: HolidaySchedule
}

export function AddHolidaySchedule({
    onAddHolidaySchedule,
    inputAddHolidaySchedule,
    errInputAddHolidaySchedule,
    selectHolidayDate,
    submitAddHolidaySchedule
}: Props) {
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
                clickClose={onAddHolidaySchedule}
                title="Add holiday schedule"
            >
                <TitleInput title='Holiday Schedule ID' />
                <Input
                    type='text'
                    nameInput='id'
                    valueInput={inputAddHolidaySchedule.id}
                    readonly
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddHolidaySchedule?.id}
                />

                <TitleInput title='Holiday Date' />
                <InputSearch
                    onCalendar={true}
                    icon={faCalendarDays}
                    placeholderText='Search Date'
                    selected={inputAddHolidaySchedule.date.length > 0 ? new Date(inputAddHolidaySchedule.date) : undefined}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={selectHolidayDate}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddHolidaySchedule?.date}
                />

                <Button
                    nameBtn='Add'
                    classLoading="hidden"
                    classBtn="hover:bg-white"
                    clickBtn={submitAddHolidaySchedule}
                />
            </FormPopup>
        </ContainerPopup>
    )
}