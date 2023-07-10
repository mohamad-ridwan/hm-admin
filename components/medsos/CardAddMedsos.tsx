'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type IconProps = {
    icon: IconDefinition
}

type Props = IconProps & {
    socialMediaName: string
    nameIcon: string
    socialMediaLinks: string
    id: string
}

export function CardAddMedsos({
    icon,
    socialMediaLinks,
    nameIcon,
    socialMediaName,
    id
}: Props) {
    return (
        <div
        className="flex flex-col bg-white shadow-sm rounded-sm p-4"
        >
            <div
                className="flex flex-wrap justify-between"
            >
                <div
                className="flex items-center"
                >
                    <FontAwesomeIcon
                        icon={icon}
                        className="text-[0.7rem] mr-2"
                    />
                    <span>{socialMediaName}</span>
                </div>

                <button>
                    <FontAwesomeIcon
                        icon={faTrash}
                        className="text-red-default text-[0.8rem]"
                    />
                </button>
            </div>

            <div
            className="flex flex-col mt-2"
            >
                <span
                className="text-sm"
                >{socialMediaLinks}</span>
                <span
                className="text-sm"
                >{nameIcon}</span>
                <span
                className="text-sm"
                >{id}</span>
            </div>
        </div>
    )
}