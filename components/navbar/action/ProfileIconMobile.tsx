'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import userDefault from 'images/user.png'
import Image from 'next/image'
import { WrappMenu } from '../dropMenu/WrappMenu'
import Link from 'next/link'
import { Menu } from '../dropMenu/Menu'
import { authStore, userIdAuthStore } from 'lib/useZustand/auth'

export function ProfileIconMobile() {
    const [onDropMenu, setOnDropMenu] = useState<boolean>(false)

    const router = useRouter()

    // zustand store
    // auth / user (admin)
    const { user, setUser } = authStore()
    // userId auth
    const { setUserId } = userIdAuthStore()

    function clickBtnProfile(): void {
        setOnDropMenu(!onDropMenu)
    }

    function logOut(): void {
        setUserId(null)
        setUser({ user: null })

        setTimeout(() => {
            router.push('/login')
        }, 50);
    }

    return (
        <button
            className='flex tablet:hidden'
            onClick={clickBtnProfile}
        >
            <div className='flex h-[2.48rem] w-[2.5rem] rounded-full overflow-hidden'>
                <Image
                    src={user.user?.image ? user.user.image : userDefault}
                    alt="admin hospice medical"
                    height={40}
                    width={40}
                    className="object-cover"
                />
            </div>

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