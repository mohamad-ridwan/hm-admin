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
    className={`${classWrapp} rounded-md text-[0.8rem] text-start text-font-color-3 hover:bg-color-default
    py-2 px-4 hover:text-white transition`} 
    onClick={(e)=>{
        if(typeof click === 'function'){
            click(e as MouseEvent<HTMLDivElement>)
        }
    }}>
        {name}
    </div>
}