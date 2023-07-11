import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    deleteSchedule: ()=>void
    dayName: string
    id?: string
    practiceHours?: string
}

export function CardAddDoctorSchedule({
    deleteSchedule,
    dayName,
    id,
    practiceHours
}: Props) {
    return (
        <div
            className="flex flex-col bg-white shadow-md rounded-sm p-4 m-1"
        >
            <div
                className="flex flex-wrap justify-between items-center"
            >
                <span
                className="text-[0.75rem]"
                >
                    {dayName}
                </span>

                <button
                onClick={deleteSchedule}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-red-default text-[0.8rem]"
                    />
                </button>
            </div>

            <span
            className="text-[0.75rem]"
            >{practiceHours}</span>
            <span
            className="text-[0.75rem]"
            >{id}</span>
        </div>
    )
}