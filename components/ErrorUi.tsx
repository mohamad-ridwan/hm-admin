'use client'

import Template from "app/template"
import Button from "./Button"
import Link from "next/link"

type Props = {
    error: Error
    reset: () => void
}

export function ErrorUi({
    error,
    reset
}: Props){
    return(
        <Template
            isNavigateOff={true}
            title="Something went wrong"
            description="terjadi kesalahan sesuatu pada admin hospice medical"
            className="flex justify-center"
        >
            <div className="flex items-center min-h-screen md:w-[26rem] px-6 py-12 mx-auto">
                <div className="flex flex-col items-center max-w-sm mx-auto text-center">
                    <p className="p-3 text-sm font-medium text-blue-500 rounded-full bg-blue-50 dark:bg-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" className="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    </p>
                    <h1 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white md:text-3xl">Something went wrong</h1>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">{error.message}</p>
                    <br />

                    <div className="flex flex-wrap justify-center items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
                        <Button
                            nameBtn="Try again"
                            classLoading="hidden"
                            colorBtnTxt="text-color-default"
                            classBtn="px-8 bg-white hover:bg-color-default hover:text-white mt-3"
                            clickBtn={()=>{
                                reset()
                                window.location.reload()
                            }}
                        />
                        <Link 
                        href="/"
                        className="mt-3"
                        >
                            <Button
                                nameBtn="Back to Home"
                                classLoading="hidden"
                                classBtn="hover:bg-white px-8"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </Template>
    )
}