'use client'

import { ChangeEvent } from "react"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import ErrorInput from "components/input/ErrorInput"
import Input from "components/input/Input"
import InputContainer from "components/input/InputContainer"
import { InputSelect } from "components/input/InputSelect"
import { TitleInput } from "components/input/TitleInput"

type ActionProps = {
    changeText: (e: ChangeEvent<HTMLInputElement>)=>void
}

function FormRegistrationData() {
    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            <HeadInfo
                titleInfo="Form Confirmation"
            />

            <InputContainer
                className="flex flex-wrap justify-between"
            >
                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Doctor Specialist"
                    />
                    <InputSelect
                        data={[]}
                    />
                    <ErrorInput
                        error="error"
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Choose Doctor"
                    />
                    <InputSelect
                        data={[]}
                    />
                    <ErrorInput
                        error="error"
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Practice Hours"
                    />
                    {/* <Input
                    type="text"
                    nameInput="Practice Hours"
                    changeInput={changeText}
                    /> */}
                    <ErrorInput
                        error="error"
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Room Name"
                    />
                    <InputSelect
                        data={[]}
                    />
                    <ErrorInput
                        error="error"
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title={`Treatment Hours "Example" (08:00 - 10:00)`}
                    />
                    {/* <Input
                    type="text"
                    nameInput="Practice Hours"
                    changeInput={changeText}
                    /> */}
                    <ErrorInput
                        error="error"
                    />
                </CardInfo>
            </InputContainer>

            {/* <div
                className="w-full flex flex-wrap justify-between"
            >

            </div> */}
        </Container>
    )
}

export default FormRegistrationData