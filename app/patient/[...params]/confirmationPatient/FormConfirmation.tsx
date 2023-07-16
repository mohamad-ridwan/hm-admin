'use client'

import { useState } from "react";
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
import { PopupSetting } from "lib/types/TableT.type";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";

export function FormConfirmation() {
    const [onPopupSetting, setOnPopupSetting] = useState<PopupSetting>({} as PopupSetting)

    const {
        counterOptions,
        value,
        setValue,
        submitForm,
        errInput,
        confirmSubmitForm,
        handleCounter,
        loadingSubmit
    } = UseForm({ setOnPopupSetting })

    function cancelPopupSetting(): void {
        setOnPopupSetting({} as PopupSetting)
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
                            clickBtn={()=>{
                                if(onPopupSetting.categoryAction === 'confirm-patient'){
                                    confirmSubmitForm()
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
                        value={value}
                        setValue={setValue}
                    />
                    <ErrorInput
                        error={errInput?.message}
                    />
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
                        handleSelect={handleCounter}
                    />
                    <ErrorInput
                        error={errInput?.loketName}
                    />
                </CardInfo>
            </InputContainer>

            <div
                className="flex w-full justify-center"
            >
                <Button
                    nameBtn="Confirm at the counter"
                    classBtn={loadingSubmit ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    classLoading={loadingSubmit ? 'flex' : 'hidden'}
                    clickBtn={submitForm}
                />
            </div>
        </Container>
    )
}