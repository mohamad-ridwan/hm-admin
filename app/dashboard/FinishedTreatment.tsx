'use client'

import {
    Chart as ChartJS,
    CategoryScale,
    RadialLinearScale,
    ArcElement,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar, PolarArea } from 'react-chartjs-2';
import { UseDashboard } from './UseDashboard';
import { InputSelect } from 'components/input/InputSelect';
import { TitleInput } from 'components/input/TitleInput';

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function FinishedTreatment() {
    const {
        optionsBarFT,
        dataBarFT,
        dataPolarFT,
        yearPTOfSelectOptions,
        handleYearsOnFinishTreatment,
        optionsPolarChartFT
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
                    id='yearFinishTreatment'
                    data={yearPTOfSelectOptions}
                    handleSelect={handleYearsOnFinishTreatment}
                    classWrapp='bg-white rounded-md border-[1px] border-[#ddd]'
                />
            </div>
            <div
                className='flex flex-wrap max-lg:flex-col justify-between'
            >
                <div
                    className="flex justify-center w-[35%] max-lg:w-full py-4 px-4 my-8 bg-white rounded-sm shadow-sm mx-1"
                >
                    <PolarArea
                        className='max-h-[400px]'
                        data={dataPolarFT}
                        options={optionsPolarChartFT}
                    />
                </div>
                <div
                    className="flex justify-center w-[62%] max-lg:w-full py-4 px-4 my-8 bg-white rounded-sm shadow-sm mx-1"
                >
                    <Bar
                        className='max-h-[400px]'
                        options={optionsBarFT}
                        data={dataBarFT}
                    />
                </div>
            </div>
        </>
    )
}