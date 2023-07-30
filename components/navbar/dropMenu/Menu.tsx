import { MouseEvent } from "react"

type Props = {
    id?: string
    name: string,
    classWrapp?: string
    click?: (e?: MouseEvent<HTMLDivElement>)=>void
}

export function Menu({
    id,
    name,
    classWrapp,
    click
}: Props){
    return <div 
    id={id}
    className={`${classWrapp} rounded-md text-[0.85rem] text-start py-2 px-4 transition hover:text-txt-white hover:bg-color-default`} 
    onClick={(e)=>{
        if(typeof click === 'function'){
            click(e as MouseEvent<HTMLDivElement>)
        }
    }}>
        {name}
    </div>
}