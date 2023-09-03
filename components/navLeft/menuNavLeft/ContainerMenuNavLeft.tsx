'use client'

import { useEffect, useState } from 'react'
import {usePathname} from 'next/navigation'
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faAngleDown, faAngleUp, faBarsProgress, faBedPulse, faChartLine, faClipboardCheck, faDoorClosed, faHospitalUser, faPeopleRoof, faSitemap, faStethoscope, faTag } from '@fortawesome/free-solid-svg-icons'
import { navigationStore } from 'lib/useZustand/navigation'
import { MenuNavLeft } from './MenuNavLeft'
import { LeftMenuNavChild } from './LeftMenuNavChild'

type StateMenu = {
    name: string
    path: string | null
    icon: IconDefinition
    children?: {
        name: string
        path: string | null
        icon: IconDefinition
    }[]
}[]

export function ContainerMenuNavLeft({
    idChildMenu
}: { idChildMenu: string }) {
    const pathname = usePathname()

    const menu: StateMenu =[
        {
            name: 'Dashboard',
            path: '/dashboard',
            icon: faBarsProgress
        },
        // {
        //     name: 'Upload Article',
        //     path: '/upload-article',
        //     icon: faSitemap
        // },
        {
            name: 'Patient',
            path: pathname.includes('/patient') ? pathname : null,
            icon: faBedPulse,
            children: [
                {
                    name: 'Patient Registration',
                    path: '/patient/patient-registration',
                    icon: faHospitalUser,
                },
                {
                    name: 'Confirmation Patient',
                    path: '/patient/confirmation-patient',
                    icon: faClipboardCheck,
                },
                {
                    name: 'Drug Counter',
                    path: '/patient/drug-counter',
                    icon: faTag,
                },
                {
                    name: 'Finished Treatment',
                    path: '/patient/finished-treatment',
                    icon: faChartLine,
                }
            ]
        },
        {
            name: 'Doctors',
            path: pathname.includes('/doctors') ? pathname : null,
            icon: faStethoscope,
            children: [
                {
                    name: 'Our Doctor',
                    path: '/doctors/our-doctor',
                    icon: faPeopleRoof
                }
            ]
        },
        {
            name: 'Rooms',
            path: '/rooms',
            icon: faDoorClosed
        },
        {
            name: 'Counters',
            path: '/counters',
            icon: faTag
        },
        // {
        //     name: 'Blog',
        //     path: null,
        //     icon: 'fa-solid fa-newspaper',
        //     children: [
        //         {
        //             name: 'Edit Blog',
        //             path: '/edit-article',
        //             icon: 'fa-solid fa-file-pen'
        //         }
        //     ]
        // }
    ]
    const [idxActiveDropMenu, setIdxActiveDropMenu] = useState<number | null>(null)
    const [heightMenuChild, setHeightMenuChild] = useState<string>('48px')

    // zustand store
    const { onNavLeft, setOnNavLeft } = navigationStore()

    function clickChildMenu(index: number): void {
        const wrappMenuChild: HTMLElement | null = document.getElementById(`${idChildMenu}${index}`)
        const getHightEl: number | undefined = wrappMenuChild?.getBoundingClientRect()?.height
        if (idxActiveDropMenu === index) {
            setIdxActiveDropMenu(null)
            setHeightMenuChild('48px')
        } else {
            setIdxActiveDropMenu(index)
            setHeightMenuChild(`${getHightEl as number + 58}px`)
        }
    }

    useEffect(()=>{
        if(onNavLeft){
            setIdxActiveDropMenu(null)
            setHeightMenuChild('48px')
        }
    }, [onNavLeft])

    return (
        <>
            {menu.map((item, index) => {
                return (
                    <MenuNavLeft
                        key={index}
                        dropIconActive={item?.children ? true : false}
                        dataChild={item?.children ? true : false}
                        childPath={item.path as string}
                        icon={item.icon}
                        name={onNavLeft ? '' : item.name}
                        iconDrop={idxActiveDropMenu === index ? faAngleUp : faAngleDown}
                        classWrappMenuChild={idxActiveDropMenu === index ? heightMenuChild : '48px'}
                        click={() => {
                            clickChildMenu(index)
                            setOnNavLeft(false)
                        }}
                        clickBtnTagA={() => setOnNavLeft(false)}
                        menuActive={item.path === pathname}
                    >
                        {item?.children && (
                            <div
                                className='flex flex-col pl-7 w-[16rem] mt-4'
                                id={`${idChildMenu}${index}`}
                            >
                                {item?.children?.map((childItem, childIdx) => {
                                    return (
                                        <LeftMenuNavChild
                                            key={childIdx}
                                            href={childItem.path as string}
                                            icon={childItem.icon}
                                            name={childItem.name}
                                            menuActive={childItem.path === pathname}
                                        />
                                    )
                                })}
                            </div>
                        )}
                    </MenuNavLeft>
                )
            })}
        </>
    )
}

