'use client'

import { range } from "lodash"
import getYear from 'date-fns/getYear'
import getMonth from 'date-fns/getMonth'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons"
import { monthDetailNames } from "lib/formats/monthDetailNames"
import { RenderCustomHeaderT } from "lib/types/DatePicker.type"

export function renderCustomHeader({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled
}: RenderCustomHeaderT
) {
    const yearsCalendar = range(1900, getYear(new Date()) + 1, 1)

    return (
        <div
            style={{
                margin: 10,
                display: "flex",
                justifyContent: "center",
            }}
            onClick={(e)=>e.stopPropagation()}
        >
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} style={{
                width: '30px',
                marginRight: '1rem'
            }}>
                <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <select
                value={getYear(date)}
                onChange={({ target: { value } }) => changeYear(value)}
                style={{
                    background: 'transparent'
                }}
            >
                {yearsCalendar.map((option: any) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <select
                value={monthDetailNames[getMonth(date)]}
                onChange={({ target: { value } }) =>
                    changeMonth(monthDetailNames.indexOf(value))
                }
                style={{
                    background: 'transparent'
                }}
            >
                {monthDetailNames.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} style={{
                width: '30px',
                marginLeft: '1rem'
            }}>
                <FontAwesomeIcon icon={faAngleRight} />
            </button>
        </div>
    )
}