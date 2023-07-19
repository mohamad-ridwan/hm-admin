import { CSSProperties, ReactNode } from "react"
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Props = {
    title?: string
    textInfo?: string | JSX.Element
    additionalInfo?: string
    icon?: IconDefinition
    children?: ReactNode
    classWrapp?: string
    styleWrapp?: CSSProperties
    styleTextInfo?: CSSProperties,
    styleTitle?: CSSProperties
}

export function CardInfo({
    classWrapp,
    title,
    textInfo,
    additionalInfo,
    icon,
    children,
    styleWrapp,
    styleTextInfo,
    styleTitle
}: Props) {
    return (
        <div
            className={`w-full max-info-card-mobile:w-[45%] my-5 ${classWrapp}`}
            style={styleWrapp}
        >
            {!children && (
                <>
                    <h1
                        className="text-font-color-3 font-bold text-start"
                        style={styleTitle}
                    >{title}</h1>
                    <p
                        className="text-sm my-1 text-start text-font-color-2"
                        style={styleTextInfo}
                    >
                        {typeof icon !== 'undefined' && (
                            <FontAwesomeIcon
                                icon={icon}
                                className="mr-1"
                            />
                        )}
                        {textInfo}
                    </p>
                    <span>{additionalInfo}</span>
                </>
            )}

            {children}
        </div>
    )
}