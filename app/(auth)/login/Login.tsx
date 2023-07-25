'use client'

import { ChangeEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { mailRegex } from 'lib/regex/mailRegex'
import { API} from 'lib/api'
import { userIdAuthStore } from 'lib/useZustand/auth'
import InputContainer from 'components/input/InputContainer'
import Input from 'components/input/Input'
import ErrorInput from 'components/input/ErrorInput'
import Link from 'next/link'
import Button from 'components/Button'
import { AuthRequiredError } from 'lib/errorHandling/exceptions'
import { sessionDateFormat } from 'lib/dates/sessionDateFormat'

type StateInput = {
    email: string
    password: string
}

export function Login() {
    const [triggedErr, setTriggedErr] = useState<boolean>(false)
    const [input, setInput] = useState<StateInput>({
        email: '',
        password: ''
    })
    const [errMsg, setErrMsg] = useState<{ [key: string]: string } | null>(null)
    const [loadingSubmit, setLoadingSubmit] = useState<boolean>(false)

    // zustand
    // userId auth
    const {setUserId, setLoginSession} = userIdAuthStore()

    if(triggedErr){
        throw new AuthRequiredError('A server error has occurred. Please try again')
    }

    const router = useRouter()

    function handleInput(e: ChangeEvent<HTMLInputElement>) {
        setInput({
            ...input,
            [e.target.name]: e.target.value
        })

        setErrMsg({
            ...errMsg,
            [e.target.name]: ''
        })
    }

    function handleSubmit(): void {
        if (loadingSubmit === false) {
            let err: { [key: string]: string } = {}

            if (!input.email.trim()) {
                err.email = 'Must be required!'
            } else if (!mailRegex.test(input.email)) {
                err.email = 'Invalid email address!'
            }
            if (!input.password.trim()) {
                err.password = 'Must be required!'
            }

            if (Object.keys(err).length === 0) {
                login()
            } else {
                setErrMsg(err)
            }
        }
    }

    function login() {
        setLoadingSubmit(true)

        API().APIGetAdmin()
            .then((result) => {
                if(typeof result === 'object'){
                    const getData = result?.data
                    if (Array.isArray(getData) && getData.length > 0) {
                        const findAdmin = getData.find(user =>
                            user.email === input.email &&
                            user.password === input.password &&
                            user.isVerification === true
                        )
    
                        if (typeof findAdmin === 'object') {
                            setUserId(findAdmin.id as string)
                            setLoginSession(sessionDateFormat(5))
                            router.push('/')
                            setLoadingSubmit(false)
                        } else {
                            setErrMsg({ password: 'Unregistered account!' })
                            setLoadingSubmit(false)
                        }
                    } else {
                        alert('no admin data found!')
                        console.log(new Error('Error data Admin'))
                        setLoadingSubmit(false)
                    }
                }
            })
            .catch((err: any) => {
                setTriggedErr(true)
                setLoadingSubmit(false)
                console.log(err)
            })
    }

    return (
        <InputContainer
            onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
            }}
            className="flex flex-col w-full"
        >
            <Input
                type="text"
                placeholder="Enter email address"
                nameInput="email"
                valueInput={input.email}
                changeInput={handleInput}
            />
            <ErrorInput
                error={errMsg?.email ? errMsg.email : ''}
            />
            <Input
                type="password"
                placeholder="Enter your password"
                nameInput="password"
                valueInput={input.password}
                changeInput={handleInput}
            />
            <ErrorInput
                error={errMsg?.password ? errMsg.password : ''}
            />
            <div className='flex justify-end'>
                <Link
                    href='/forgot-password'
                    className='text-[0.8rem] text-font-color-2 my-4'
                >
                    Forgot password?
                </Link>
            </div>
            <Button
                classBtn={loadingSubmit ? 'hover:text-white hover:bg-color-default cursor-default' : 'hover:bg-white'}
                nameBtn="LOGIN"
                clickBtn={handleSubmit}
                disabled={loadingSubmit ? true : false}
                classLoading={loadingSubmit ? '' : 'hidden'}
            />
            <div className='flex flex-wrap justify-center mt-9'>
                <span className='text-center text-[0.8rem] text-font-color-2'>
                    {`Don't`} have an account yet?
                </span>

                <Link href='/register' className='text-color-default text-[0.8rem] ml-1'>
                    Register now
                </Link>
            </div>
        </InputContainer>
    )
}