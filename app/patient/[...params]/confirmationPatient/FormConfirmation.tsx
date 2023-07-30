'use client'

import Button from "components/Button";
import { Container } from "components/Container";
import { CardInfo } from "components/dataInformation/CardInfo";
import { HeadInfo } from "components/dataInformation/HeadInfo";
import ErrorInput from "components/input/ErrorInput";
import InputContainer from "components/input/InputContainer";
import { InputSelect } from "components/input/InputSelect";
import { TitleInput } from "components/input/TitleInput";
import { UseForm } from "./UseConfirmation";
import { TinyEditor } from "components/tinyEditor/TinyEditor";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { SettingPopup } from "components/popup/SettingPopup";
import { ActionsDataT } from "lib/types/TableT.type";
import { FormPopup } from "components/popup/FormPopup";
import Input from "components/input/Input";

export function FormConfirmation({params}: {params: string}) {
    const {
        counterOptions,
        value,
        setValue,
        submitForm,
        errInput,
        handleCounter,
        loadingSubmit,
        isMenuActive,
        clickMenu,
        clickCancelTreatment,
        loadingCancelTreatment,
        onMsgCancelTreatment,
        onModalSettings,
        cancelOnMsgCancelPatient,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment,
        doctorIsAvailable
    } = UseForm({params})

    const actionsMenu: ActionsDataT[] = [
        {
            name: 'Cancel Treatment',
            classWrapp: loadingCancelTreatment ? 'text-not-allowed hover:text-not-allowed hover:bg-white cursor-not-allowed' : 'cursor-pointer text-pink-old',
            click: () => clickCancelTreatment()
        },
    ]

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            {onModalSettings?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={onModalSettings.clickClose}
                        title={onModalSettings.title}
                        classIcon={onModalSettings.classIcon}
                        iconPopup={onModalSettings.iconPopup}
                    >
                        {onModalSettings.actionsData.length > 0 && onModalSettings.actionsData.map((btn, idx) => {
                            return (
                                <Button
                                    key={idx}
                                    nameBtn={btn.nameBtn}
                                    classBtn={btn.classBtn}
                                    classLoading={btn.classLoading}
                                    clickBtn={btn.clickBtn}
                                    styleBtn={btn.styleBtn}
                                />
                            )
                        })}
                    </SettingPopup>
                </ContainerPopup>
            )}

            {onMsgCancelTreatment && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
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
                titleInfo="Form Confirm to Take Medicine"
                classTitle="border-none"
                styleHeadTop={{
                    padding: '0'
                }}
                actionsData={actionsMenu}
                classWrappMenu={`${isMenuActive ? 'flex' : 'hidden'} right-9`}
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
                    classBtn={loadingSubmit || !doctorIsAvailable ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    classLoading={loadingSubmit ? 'flex' : 'hidden'}
                    clickBtn={submitForm}
                />
            </div>
        </Container>
    )
}