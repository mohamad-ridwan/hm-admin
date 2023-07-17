'use client'

import { CSSProperties, useState } from "react"
import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import InputContainer from "components/input/InputContainer"
import { TitleInput } from "components/input/TitleInput"
import { UseForm } from "./UseForm"
import { TinyEditor } from "components/tinyEditor/TinyEditor"
import ErrorInput from "components/input/ErrorInput"
import { InputSelect } from "components/input/InputSelect"
import Input from "components/input/Input"
import Button from "components/Button"
import { PopupSetting } from "lib/types/TableT.type"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"

export function CounterForm({ params }: { params: string }) {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)

    const {
        value,
        setValue,
        errInput,
        paymentOptions,
        handlePayment,
        inputForm,
        handleInputTxt,
        submitForm,
        loadingSubmit,
        confirmSubmit
    } = UseForm({ setOnPopupSetting, params })

    function cancelPopupSetting(): void {
        setOnPopupSetting({} as PopupSetting)
    }

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            {onPopupSetting?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={cancelPopupSetting}
                        title={onPopupSetting.title}
                        classIcon='text-font-color-2'
                        iconPopup={onPopupSetting.iconPopup}
                    >
                        <Button
                            nameBtn={onPopupSetting.nameBtnNext}
                            classBtn="hover:bg-white"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.6rem',
                                marginTop: '0.5rem'
                            }}
                            clickBtn={() => {
                                if (onPopupSetting.categoryAction === 'confirm-payment') {
                                    confirmSubmit()
                                }
                            }}
                        />
                        <Button
                            nameBtn="Cancel"
                            classBtn="bg-white border-none"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginTop: '0.5rem',
                                color: '#495057'
                            }}
                            clickBtn={cancelPopupSetting}
                        />
                    </SettingPopup>
                </ContainerPopup>
            )}

            <HeadInfo
                titleInfo="Form Confirmation"
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
                        title="Message"
                    />
                    <TinyEditor
                        value={value}
                        setValue={setValue}
                    />
                    <ErrorInput
                        {...styleError}
                        error={errInput?.message}
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Select Payment Method"
                    />
                    <InputSelect
                        id="paymentMethod"
                        classWrapp="w-fit"
                        data={paymentOptions}
                        handleSelect={handlePayment}
                    />
                    <ErrorInput
                        {...styleError}
                        error={errInput?.paymentMethod}
                    />
                </CardInfo>

                {inputForm.paymentMethod === 'cash' && (
                    <CardInfo
                        classWrapp="flex flex-col"
                    >
                        <TitleInput
                            title="Total Cost"
                        />
                        <Input
                            nameInput="totalCost"
                            type="number"
                            placeholder="320..."
                            changeInput={handleInputTxt}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInput?.totalCost}
                        />
                    </CardInfo>
                )}

                {inputForm.paymentMethod === 'BPJS' && (
                    <CardInfo
                        classWrapp="flex flex-col"
                    >
                        <TitleInput
                            title="BPJS Number"
                        />
                        <Input
                            nameInput="bpjsNumber"
                            type="number"
                            placeholder="163201..."
                            changeInput={handleInputTxt}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInput?.bpjsNumber}
                        />
                    </CardInfo>
                )}

                <div
                    className="flex w-full justify-center"
                >
                    <Button
                        nameBtn="Confirm Payment"
                        classBtn={loadingSubmit ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                        classLoading={loadingSubmit ? 'flex' : 'hidden'}
                        clickBtn={submitForm}
                    />
                </div>
            </InputContainer>
        </Container>
    )
}