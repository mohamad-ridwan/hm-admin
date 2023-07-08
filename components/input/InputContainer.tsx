import { ComponentType, HTMLAttributes } from "react"

type Props = {
    tag?: ComponentType | keyof JSX.IntrinsicElements
    classWrapp?: string
}

export default function InputContainer({
    tag: Wrapper = 'form',
    children,
    classWrapp,
    ...rest
}: Props & HTMLAttributes<HTMLOrSVGElement>){
    return(
        <Wrapper 
        {...rest}>
            {children}
        </Wrapper>
    )
}