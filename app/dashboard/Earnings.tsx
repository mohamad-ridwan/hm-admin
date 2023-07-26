'use client'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2';
import { TitleInput } from "components/input/TitleInput"
import { UseDashboard } from "./UseDashboard"
import { InputSelect } from "components/input/InputSelect"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

export function Earnings() {
    const {
        yearPTOfSelectOptions,
        handleYearsOnEarnings,
        optionsBarEarnings,
        dataBarEarnings,
        yearsOnEarnings,
        resultEarningOnYears
    } = UseDashboard()

    return (
        <>
            <div
                className='flex justify-end items-center'
            >
                <TitleInput
                    title='Year in'
                    className='mb-0 mr-2'
                />
                <InputSelect
                    id='yearEarnings'
                    data={yearPTOfSelectOptions}
                    handleSelect={handleYearsOnEarnings}
                    classWrapp='bg-white rounded-md border-[1px] border-[#ddd]'
                />
            </div>
            <div
                className='flex flex-wrap max-lg:flex-col justify-between'
            >
                <div
                    className="flex flex-col w-[30%] max-lg:w-full py-4 px-4 my-8 bg-white rounded-sm shadow-sm mx-1"
                >
                    <h1
                        className='text-pink-old text-4xl font-semibold'
                    >{resultEarningOnYears}</h1>
                    <p
                        className='text-font-color-3 mt-2'
                    >Total earnings for the year ({yearsOnEarnings})</p>

                    <span
                        className='text-font-color-3 mt-8 text-sm text-start'
                    >
                        Income is only calculated from the total patient payment methods in cash.
                    </span>
                    <span
                    className='text-pink-old font-semibold mt-2 text-sm text-start'
                    >
                        Notes : BPJS does not include income calculations.
                    </span>
                </div>
                <div
                    className="flex justify-center w-[67%] max-lg:w-full py-4 px-4 my-8 bg-white rounded-sm shadow-sm mx-1"
                >
                    <Bar
                        options={optionsBarEarnings}
                        data={dataBarEarnings}
                    />
                </div>
            </div>
        </>
    )
}