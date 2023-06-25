'use client'

import Link from "next/link";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "components/Button";

type Props = {
    href: string
}

export function BackToLogin({
    href
}: Props) {
    return (
        <Link
            href={href}
            className='flex justify-center mt-8'
        >
            <Button
                nameBtn="Back to log in"
                classLoading="hidden"
                icon={
                    <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-2"
                    />
                }
                styleBtn={{
                    flexDirection: 'row-reverse',
                    padding: '0',
                    color: '#3face4',
                    background: 'none',
                    border: 'none'
                }}
            />
        </Link>
    )
}