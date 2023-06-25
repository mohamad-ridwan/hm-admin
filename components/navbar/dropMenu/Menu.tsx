type Props = {
    name: string,
    click?: ()=>void
}

export function Menu({
    name,
    click
}: Props){
    return <div className="text-[0.83rem] text-start uppercase text-font-color-3 hover:bg-color-default
    py-2 px-4 hover:text-white transition" onClick={click}>
        {name}
    </div>
}