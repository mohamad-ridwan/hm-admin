import Image from "next/image"
import Link from "next/link"
import userDefault from 'images/user.png'
import { ButtonProfile } from "./action/ButtonProfile"
import MainNavbar from "./MainNavbar"

export async function Navbar() {
    return (
        <MainNavbar>
            <Link href='/'>
                {/* <Image
                    src={logo}
                    alt="hospice medical admin"
                /> */}
            </Link>
            <div className="flex items-center">
                {/* profile (desktop) */}
                <Link href='/profile'>
                    <Image
                        src={userDefault}
                        alt="admin hospice medical"
                        height={40}
                        width={40}
                        className="object-cover"
                    />
                </Link>

                <ButtonProfile />
            </div>
        </MainNavbar>
    )
}