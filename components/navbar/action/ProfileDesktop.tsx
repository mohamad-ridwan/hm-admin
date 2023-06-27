'use client'

import Image from "next/image"
import Link from "next/link"
import userDefault from 'images/user.png'
import { ButtonProfile } from "./ButtonProfile"
import { authStore } from "lib/useZustand/auth"

export function ProfileDesktop() {
    const {user} = authStore()

    return (
        <>
            <Link
                href='/profile'
                className="hidden tablet:flex h-[2.49em] w-[2.5rem] rounded-full overflow-hidden"
            >
                <Image
                    src={user.user?.image ? user.user.image : userDefault}
                    alt="admin hospice medical"
                    height={40}
                    width={40}
                    className="object-cover"
                />
            </Link>

            <ButtonProfile />
        </>
    )
}