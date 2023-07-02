'use client'

import { CSSProperties, ChangeEvent } from "react"
import DatePicker from 'react-datepicker'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import Input from "./Input"
import "react-datepicker/dist/react-datepicker.css"
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import { RenderCustomHeaderT } from "lib/types/DatePicker.type"

type WrappProps = {
    classWrapp?: string
}

type IconProps = {
    icon?: IconDefinition
    onCloseSearch?: boolean
    clickCloseSearch?: () => void
}

type InputProps = {
    type?: string
    nameInput?: string
    placeHolder?: string
    changeInput?: (e?: ChangeEvent<HTMLInputElement>) => void
    valueText?: string
}

type DatePickerProps = {
    onCalendar?: boolean
    placeholderText?: string
    selected?: Date
    minDate?: Date
    maxDate?: Date
    filterDate?: number
    renderCustomHeader?: ({}: RenderCustomHeaderT)=>void
    classDate?: string
    styleDate?: CSSProperties
}

type Props = WrappProps & IconProps & InputProps & DatePickerProps

export function InputSearch({
    classWrapp,
    icon,
    onCloseSearch,
    clickCloseSearch,
    type,
    nameInput,
    placeHolder,
    changeInput,
    valueText,
    onCalendar,
    selected,
    placeholderText,
    minDate,
    maxDate,
    filterDate,
    renderCustomHeader,
    classDate,
    styleDate
}: Props) {
    return (
        <div
            className={`flex overflow-hidden items-center rounded-sm px-2 bg-gray-search text-[#aaa] ${classWrapp}`}
        >
            <div>
                <FontAwesomeIcon
                    icon={icon as IconDefinition}
                    className="text-sm"
                />
            </div>

            {!onCalendar && (
                <Input
                    type={type as string}
                    nameInput={nameInput as string}
                    changeInput={changeInput as (e?: ChangeEvent<HTMLInputElement>) => void}
                    placeholder={placeHolder}
                    valueInput={valueText}
                    styles={{
                        padding: '0.4rem 0.6rem',
                        border: 'none',
                        background: 'none',
                        fontSize: '0.8rem'
                    }}
                />
            )}

            {onCalendar && (
                <DatePicker
                    onChange={changeInput}
                    selected={selected}
                    minDate={minDate}
                    maxDate={maxDate}
                    filterDate={filterDate}
                    className={`bg-transparent py-[0.6rem] px-[0.6rem] text-[0.8rem] outline-none ${classDate}`}
                    placeholderText={placeholderText}
                    renderCustomHeader={renderCustomHeader}
                    style={styleDate}
                />
            )}

            {onCloseSearch && (
                <button
                    onClick={clickCloseSearch}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-sm"
                    />
                </button>
            )}
        </div>
    )
}