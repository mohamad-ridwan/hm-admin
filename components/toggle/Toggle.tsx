'use client'

import 'components/toggle/Toggle.css'

type Props = {
    classWrapp?: string
    labelText?: string
    idToggle?: string
    clickToggle?: ()=>void
}

export function Toggle({
    classWrapp,
    labelText,
    idToggle = 'toggle',
    clickToggle
}: Props) {
    return (
        <div
        className={classWrapp}
        >
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name={idToggle} id={idToggle} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" onClick={clickToggle}/>
                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                ></label>
            </div>
            <label className="text-xs text-gray-700 z-[1]">{labelText}</label>
        </div>
    )
}