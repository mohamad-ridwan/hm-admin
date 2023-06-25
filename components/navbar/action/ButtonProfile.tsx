'use client'

import { useState } from 'react'
import {useRouter} from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import { WrappMenu } from '../dropMenu/WrappMenu'
import Link from 'next/link'
import { Menu } from '../dropMenu/Menu'
import { authStore, userIdAuthStore } from 'lib/useZustand/auth'

export function ButtonProfile() {
    const [onDropMenu, setOnDropMenu] = useState<boolean>(false)

    // zustand store
    // auth / user (admin)
    const {setUser} = authStore()
    // userId auth
    const {setUserId} = userIdAuthStore()

    const router = useRouter()

    function clickBtnProfile(): void {
        setOnDropMenu(!onDropMenu)
    }

    function logOut(): void{
        setUserId(null)
        setUser({user: null})

        setTimeout(() => {
            toPage('/login')
        }, 50);
    }

    function toPage(path: string): void{
        router.push(path)
    }

    return (
        <button className='flex ml-3 items-center' onClick={clickBtnProfile}>
            <span className='text-font-color-3 font-bold text-[0.95rem]'>
                M.Ridwan
            </span>
            <FontAwesomeIcon
                className='mt-[-0.45rem] ml-2'
                icon={faSortDown}
            />

            {onDropMenu && (
                <WrappMenu>
                    <Link
                        href='/profile'
                    >
                        <Menu
                            name='profile'
                        />
                    </Link>
                    <Menu 
                    name='log out'
                    click={logOut}
                    />
                </WrappMenu>
            )}
        </button>
    )
}