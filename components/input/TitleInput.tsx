type Props = {
    title: string
    className?: string
}

export function TitleInput({
    title,
    className
}: Props){
    return(
        <h1
        className={`${className} mb-2 text-sm text-font-color-2 font-semibold text-start`}
        >{title}</h1>
    )
}