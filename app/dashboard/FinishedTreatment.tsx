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
        handleYearsOnFinishTreatment
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
                className="flex justify-center py-4 px-1 my-8 bg-white rounded-sm shadow-sm mx-1"
            >
                <PolarArea
                    className='max-h-[400px]'
                    data={dataPolarFT}
                />
            </div>
            <div
                className="py-4 px-1 my-8 bg-white rounded-sm shadow-sm mx-1"
            >
                <Bar
                    options={optionsBarFT}
                    data={dataBarFT}
                />
            </div>
        </>
    )
}