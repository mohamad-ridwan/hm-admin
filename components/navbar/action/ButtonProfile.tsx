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
    const {user, setUser} = authStore()
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

    const adminName: string = user.user?.name?.length as number < 15 ? user.user?.name as string : `${user.user?.name?.substr(0, 15)}...`

    return (
        <button 
        className='hidden tablet:flex ml-3 items-center' 
        onClick={clickBtnProfile}
        >
            <span className='text-font-color-3 font-bold text-[0.95rem]'>
                {adminName}
            </span>
            <FontAwesomeIcon
                className='mt-[-0.45rem] ml-2'
                icon={faSortDown}
            />

            {onDropMenu && (
                <WrappMenu
                classWrapp='top-[4.5rem] min-w-[120px] right-3'
                >
                    <Link
                        href='/profile'
                    >
                        <Menu
                            name='Profile'
                        />
                    </Link>
                    <Menu
                    name='Log Out'
                    click={logOut}
                    />
                </WrappMenu>
            )}
        </button>
    )
}