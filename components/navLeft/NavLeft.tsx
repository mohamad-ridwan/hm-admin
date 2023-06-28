import Link from "next/link";
import { MainNavLeft } from "./MainNavLeft";
import Image from "next/image";
import logo from 'images/logo.png'
import { ContainerMenuNavLeft } from "./menuNavLeft/ContainerMenuNavLeft";
import { BtnOnNavLeft } from "./BtnOnNavLeft";
import { CopyRight } from "./CopyRight";

export function NavLeft() {
    return (
        <MainNavLeft>
            <div
                className="border-b-bdr-one border-bdr-bottom px-4"
            >
                <Link 
                href='/'
                className="flex items-center h-[4.5rem]"
                >
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
                    idChildMenu="menuNavChildMobile"
                    />
                </ul>
            </div>

            {/* created by */}
            <CopyRight/>

            {/* btn on navleft */}
            <BtnOnNavLeft/>
        </MainNavLeft>
    )
}