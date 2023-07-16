'use client'

import Button from "components/Button";
import { Container } from "components/Container";
import { CardInfo } from "components/dataInformation/CardInfo";
import { HeadInfo } from "components/dataInformation/HeadInfo";
import ErrorInput from "components/input/ErrorInput";
import InputContainer from "components/input/InputContainer";
import { InputSelect } from "components/input/InputSelect";
import { TitleInput } from "components/input/TitleInput";
import { UseForm } from "./UseForm";
import { TinyEditor } from "components/tinyEditor/TinyEditor";

export function FormConfirmation() {
    const {
        counterOptions,
        value,
        setValue
    } = UseForm()

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            <HeadInfo
                titleInfo="Form Confirm to Take Medicine"
                // classEditBtn={`bg-orange-young border-orange-young hover:bg-orange hover:border-orange ${loadingCancelTreatment && 'cursor-not-allowed'}`}
                classTitle="border-none"
                styleHeadTop={{
                    padding: '0'
                }}
                classDeleteBtn="hidden"
            />

            <InputContainer
                className="flex flex-wrap justify-between"
            >
                <CardInfo
                    classWrapp="flex flex-col"
                    styleWrapp={{
                        width: '100%'
                    }}
                >
                    <TitleInput
                        title={`Doctor's Prescription`}
                    />
                    <TinyEditor
                    initialText="Medicine from a doctor such as capsules 3x1 day"
                    value={value}
                    setValue={setValue}
                    />
                    {/* <ErrorInput
                        error={errInputValue?.practiceHours}
                    /> */}
                </CardInfo>

                <CardInfo
                classWrapp="flex flex-col"
                >
                    <TitleInput
                        title='Select Counter'
                    />
                    <InputSelect
                        id="selectCounter"
                        data={counterOptions}
                    />
                    {/* <ErrorInput
                        error={errInputValue?.practiceHours}
                    /> */}
                </CardInfo>
            </InputContainer>

            <div
                className="flex w-full justify-center"
            >
                <Button
                    nameBtn="Confirm at the counter"
                    classBtn="hover:bg-white"
                    classLoading="hidden"
                />
            </div>
        </Container>
    )
}