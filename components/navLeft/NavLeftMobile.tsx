import Image from "next/image";
import logo from 'images/logo.png'
import { MainNavLeftMobile } from "./MainNavLeftMobile";
import Link from "next/link";
import { ContainerMenuNavLeft } from "./menuNavLeft/ContainerMenuNavLeft";
import { CopyRight } from "./CopyRight";
import { BtnOnNavLeft } from "./BtnOnNavLeft";

export function NavLeftMobile() {
    return (
        <MainNavLeftMobile>
            <div
                className="border-b-bdr-one border-bdr-bottom py-[0.98rem] px-4"
            >
                <Link href='/'>
                    <Image
                        src={logo}
                        height={40}
                        width={40}
                        className="object-cover"
                        alt="admin hospice medical"
                    />
                </Link>
            </div>
            {/* container scroll navleft */}
            <div
                className="h-fit pt-8 w-full max-h-[60vh] overflow-y-auto overflow-x-hidden"
            >
                {/* scroll */}
                <ul className="flex flex-col list-none">
                    <ContainerMenuNavLeft
                    idChildMenu="menuNavChildDesktop"
                    />
                </ul>
            </div>

            {/* created by */}
            <CopyRight />

            {/* btn on navleft */}
            <BtnOnNavLeft />
        </MainNavLeftMobile>
    )
}