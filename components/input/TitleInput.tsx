type Props = {
    title: string
}

export function TitleInput({
    title
}: Props){
    return(
        <h1
        className="mb-2 text-sm text-font-color-2 font-semibold text-start"
        >{title}</h1>
    )
}