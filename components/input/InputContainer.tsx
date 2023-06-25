import { ComponentType, HTMLAttributes } from "react"

type Props = {
    tag?: ComponentType | keyof JSX.IntrinsicElements
}

export default function InputContainer({
    tag: Wrapper = 'form',
    children,
    ...rest
}: Props & HTMLAttributes<HTMLOrSVGElement>){
    return(
        <Wrapper 
        {...rest}
        className="w-full flex flex-col">
            {children}
        </Wrapper>
    )
}