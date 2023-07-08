import { ReactNode } from "react"

type Props = {
    children: ReactNode
}

function ContainerFormConfirm({
    children
}: Props){
    return(
        <div
        className="flex flex-col w-96 max-[468px]:w-full"
        >
            {children}
        </div>
    )
}

export default ContainerFormConfirm