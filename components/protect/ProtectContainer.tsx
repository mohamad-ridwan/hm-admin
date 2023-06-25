import { ReactElement, ReactNode } from 'react'

type Props = {
    icon?: ReactElement
    title: string
    children: ReactNode
    desc?: string
    adminEmail?: string
}

export default function ProtectContainer({
    icon,
    title,
    children,
    desc,
    adminEmail
}: Props) {
    return (
        <div className="mx-5 flex py-28 justify-center">
            <div className="w-96 bg-white mx-auto p-8 relative">
                {typeof icon !== 'undefined' && (
                    <div className='flex justify-center mb-4'>
                        <div className={`h-9 w-9 rounded-full border-[6px] flex justify-center items-center bg-key-color border-color-grey-white text-color-default`}>
                            {icon}
                        </div>
                    </div>
                )}
                <h2 className="font-bold text-xl text-center mb-3">{title}</h2>
                {typeof desc === 'string' && (
                    <div className='text-sm mt-4 flex flex-wrap justify-center text-font-color-2'>
                        <p className='text-center'>{desc}</p>
                        <span className='ml-1 font-bold text-center'>{adminEmail}</span>
                    </div>
                )}
                {children}
            </div>
        </div>
    )
}