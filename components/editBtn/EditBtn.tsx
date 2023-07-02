'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "components/Button"

type Props = {
    icon: IconDefinition | undefined
    idIcon?: string
    idLoading?: string
    classLoading?: string
    classBtn?: string
    padding?: string
    clickBtn?: (e?: MouseEvent) => void
}

export function EditBtn({
    icon,
    idIcon,
    idLoading,
    classBtn,
    classLoading = 'hidden',
    padding = '0.45rem 0.6rem',
    clickBtn
}: Props) {
    return (
        <Button
            idLoading={idLoading}
            icon={
                typeof icon !== 'undefined' ? <FontAwesomeIcon
                    id={idIcon}
                    icon={icon as IconDefinition}
                    className="text-[0.7rem]"
                /> :
                    undefined
            }
            classLoading={classLoading}
            heightWidthLoading="h-3 w-3"
            styleCircleLoading={{
                marginLeft: '0',
                borderTopColor: 'transparent'
            }}
            classBtn={`${classBtn} rounded-sm`}
            styleBtn={{
                padding: padding
            }}
            clickBtn={clickBtn}
        />
    )
}