import Link from "next/link";
import { MainNavLeft } from "./MainNavLeft";
import Image from "next/image";
import logo from 'images/logo.png'
import { ContainerMenuNavLeft } from "./menuNavLeft/ContainerMenuNavLeft";
import { BtnOnNavLeft } from "./BtnOnNavLeft";

export function NavLeft() {
    return (
        <MainNavLeft>
            <div
                className="border-b-bdr-one border-bdr-bottom py-[0.98rem] px-6"
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
                    <ContainerMenuNavLeft />
                </ul>
            </div>

            {/* created by */}
            <div
                className='py-4 px-6 border-t-bdr-one border-b-bdr-one border-bdr-bottom'
            >
                <h1
                className="font-bold text-font-color-2 text-xl"
                >
                    Created by
                </h1>
                <span
                className="text-sm text-font-color-2 mt-4"
                >Ridwan</span>
            </div>

            {/* btn on navleft */}
            <BtnOnNavLeft/>
        </MainNavLeft>
    )
}