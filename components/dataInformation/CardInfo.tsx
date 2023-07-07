import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    title: string
    textInfo: string
    additionalInfo?: string
    icon?: IconDefinition
}

export function CardInfo({
    title,
    textInfo,
    additionalInfo,
    icon
}: Props){
    return(
        <div
        className="w-full max-info-card-mobile:w-[45%] my-5"
        >
            <h1
            className="text-font-color-3 font-bold text-start"
            >{title}</h1>
            <p
            className="text-sm my-1 text-start text-font-color-2"
            >
                <FontAwesomeIcon
                    icon={icon as IconDefinition}
                    className="mr-1"
                />
                {textInfo}
            </p>
            <span>{additionalInfo}</span>
        </div>
    )
}