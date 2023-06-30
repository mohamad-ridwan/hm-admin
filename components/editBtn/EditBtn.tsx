'use client'

import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "components/Button"

type Props = {
    icon: IconDefinition | undefined
    classLoading?: string
    classBtn?: string
    padding?: string
    clickBtn?: (e?: MouseEvent)=>void
}

export function EditBtn({
    icon,
    classBtn,
    classLoading = 'hidden',
    padding = '0.45rem 0.6rem',
    clickBtn
}: Props) {
    return (
        <Button
            icon={
                typeof icon !== 'undefined' ? <FontAwesomeIcon
                icon={icon as IconDefinition}
                className="text-[0.7rem]"
                /> :
                undefined
            }
            classLoading={classLoading}
            heightWidthLoading="h-3 w-3 ml-[0px] border-t-[transparent]"
            classBtn={`${classBtn} rounded-sm`}
            styleBtn={{
                padding: padding
            }}
            clickBtn={clickBtn}
        />
    )
}