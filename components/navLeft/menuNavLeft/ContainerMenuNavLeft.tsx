'use client'

import { useState, useEffect } from 'react'
import { IconDefinition } from "@fortawesome/fontawesome-svg-core"
import { faAngleDown, faAngleUp, faBarsProgress, faBedPulse, faChartLine, faClipboardCheck, faHospitalUser, faSitemap, faTag } from '@fortawesome/free-solid-svg-icons'
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
}: {idChildMenu: string}) {
    const [menu, setMenu] = useState<StateMenu>([
        {
            name: 'Dashboard',
            path: '/',
            icon: faBarsProgress
        },
        {
            name: 'Upload Article',
            path: '/upload-article',
            icon: faSitemap
        },
        {
            name: 'Patient',
            path: null,
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
    ])
    const [onListMenu, setOnListMenu] = useState<StateMenu>([] as StateMenu)
    const [idxActiveDropMenu, setIdxActiveDropMenu] = useState<number | null>(null)
    const [heightMenuChild, setHeightMenuChild] = useState<string>('48px')

    // zustand store
    const { onNavLeft } = navigationStore()

    function handleOnListMenu(): void {
        if (onNavLeft) {
            const offChildMenu: StateMenu = menu.filter(item => !item.children)
            setOnListMenu(offChildMenu)
        } else {
            setTimeout(() => {
                setOnListMenu(menu)
            }, 150);
        }
    }

    useEffect(() => {
        handleOnListMenu()
    }, [onNavLeft])

    function clickChildMenu(index: number): void {
        const wrappMenuChild: HTMLElement | null = document.getElementById(`${idChildMenu}${index}`)
        const getHightEl: number | undefined = wrappMenuChild?.getBoundingClientRect()?.height
        if (idxActiveDropMenu === index) {
            setIdxActiveDropMenu(null)
            setHeightMenuChild(`48px`)
        } else {
            setIdxActiveDropMenu(index)
            setHeightMenuChild(`${getHightEl as number + 58}px`)
        }
    }

    return (
        <>
            {onListMenu.map((item, index) => {
                return (
                    <MenuNavLeft
                        key={index}
                        dropIconActive={item?.children ? true : false}
                        dataChild={item?.children ? true : false}
                        childPath={item.path as string}
                        icon={item.icon}
                        name={onNavLeft ? '' : item.name}
                        iconDrop={idxActiveDropMenu === index ? faAngleUp : faAngleDown}
                        classWrappMenuChild={heightMenuChild}
                        click={() => clickChildMenu(index)}
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

