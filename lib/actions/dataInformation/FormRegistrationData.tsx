'use client'

import { Container } from "components/Container"
import ContainerFormConfirm from "components/dataInformation/ContainerFormConfirm"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import ErrorInput from "components/input/ErrorInput"
import InputContainer from "components/input/InputContainer"
import { InputSelect } from "components/input/InputSelect"
import { TitleInput } from "components/input/TitleInput"

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
                <ContainerFormConfirm
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
                </ContainerFormConfirm>

                <ContainerFormConfirm
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
                </ContainerFormConfirm>
            </InputContainer>

            {/* <div
                className="w-full flex flex-wrap justify-between"
            >

            </div> */}
        </Container>
    )
}

export default FormRegistrationData