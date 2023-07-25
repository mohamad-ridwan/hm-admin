import { CSSProperties } from "react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type PropsDataCard = {
    icon: IconDefinition
    title: string
    value: number | string
    styleIcon?: CSSProperties
}

type Props = {
    classIcon?: string
    data: PropsDataCard[]
}

export function OverviewCard({
    classIcon,
    data
}: Props) {
    return (
        <>
            {data.length > 0 && data.map((item, index) => {
                return (
                    <div
                        key={index}
                        className="flex items-center bg-white rounded-md shadow-md py-2 px-4"
                    >
                        <div
                            className={`${classIcon} flex h-11 w-11 justify-center items-center text-white rounded-md mr-6 p`}
                            style={item.styleIcon}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                        </div>

                        <div
                            className="flex flex-col"
                        >
                            <h1
                                className="text-font-color-2 text-start"
                            >
                                {item.title}
                            </h1>
                            <span
                                className="text-2xl text-color-default-old mt-2 font-semibold text-start"
                            >{item.value}</span>
                        </div>
                    </div>
                )
            })}
        </>
    )
}