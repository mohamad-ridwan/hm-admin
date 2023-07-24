'use client'

import { CSSProperties } from "react"
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
import { ActionsDataT} from "lib/types/TableT.type"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import { FormPopup } from "components/popup/FormPopup"

export function CounterForm({ params }: { params: string }) {
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
        confirmSubmit,
        isActiveMenu,
        clickMenu,
        onPopupSetting,
        cancelPopupSetting,
        clickCancelTreatment,
        loadingCancelTreatment,
        clickYesForCancelTreatment,
        onMsgCancelTreatment,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment
    } = UseForm({ params })

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Cancel Treatment',
            classWrapp: loadingCancelTreatment ? 'hover:bg-white cursor-not-allowed text-not-allowed hover:text-not-allowed' : 'cursor-pointer text-pink-old',
            click: () => clickCancelTreatment()
        },
    ]

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
                                } else if (onPopupSetting.categoryAction === 'cancel-treatment') {
                                    clickYesForCancelTreatment()
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

            {onMsgCancelTreatment && (
                <ContainerPopup
                    className='flex justify-center overflow-y-auto'
                >
                    <FormPopup
                        tag="div"
                        clickClose={cancelOnMsgCancelPatient}
                        title="Messages for canceled patients"
                    >
                        <TitleInput title='Message' />
                        <Input
                            type='text'
                            nameInput='messageCancelled'
                            changeInput={handleCancelMsg}
                            valueInput={inputMsgCancelPatient}
                        />
                        <ErrorInput
                            error={inputMsgCancelPatient.length === 0 ? 'Must be required' : ''}
                        />

                        <div
                            className="flex flex-wrap justify-end"
                        >
                            <Button
                                nameBtn="Confirm"
                                classBtn="hover:bg-white"
                                classLoading="hidden"
                                styleBtn={{
                                    padding: '0.5rem',
                                    marginTop: '0.5rem',
                                }}
                                clickBtn={submitCancelTreatment}
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
                                clickBtn={cancelOnMsgCancelPatient}
                            />
                        </div>
                    </FormPopup>
                </ContainerPopup>
            )}

            <HeadInfo
                titleInfo="Form Confirmation"
                classTitle="border-none"
                styleHeadTop={{
                    padding: '0'
                }}
                actionsData={actionsMenu}
                classWrappMenu={`${isActiveMenu ? 'flex' : 'hidden'} right-9`}
                clickMenu={clickMenu}
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