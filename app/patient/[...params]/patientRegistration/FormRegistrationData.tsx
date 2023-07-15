import { Container } from "components/Container"
import { CardInfo } from "components/dataInformation/CardInfo"
import { HeadInfo } from "components/dataInformation/HeadInfo"
import ErrorInput from "components/input/ErrorInput"
import Input from "components/input/Input"
import InputContainer from "components/input/InputContainer"
import { InputSelect } from "components/input/InputSelect"
import { TitleInput } from "components/input/TitleInput"
import Button from "components/Button"
import { HandleFormRegistration } from "./HandleFormRegistration"
import { Toggle } from "components/toggle/Toggle"
import { faBan } from "@fortawesome/free-solid-svg-icons"
import { DeletePatient } from "./DeletePatient"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"
import { FormPopup } from "components/popup/FormPopup"

function FormRegistrationData({ params }: { params: string }) {
    const {
        optionsSpecialist,
        handleSelect,
        submitConfirmation,
        errInputValue,
        optionsDoctor,
        optionsRoom,
        inputValue,
        clickToggleAutoRoom,
        loadingSubmit
    } = HandleFormRegistration(
        { params }
    )

    const {
        loadingCancelTreatment,
        onPopupSettings,
        setOnPopupSettings,
        clickCancelTreatment,
        onMsgCancelTreatment,
        setOnMsgCancelTreatment,
        handleCancelMsg,
        inputMsgCancelPatient,
        submitCancelTreatment
    } = DeletePatient({ params })

    function cancelPopupSetting(): void {
        setOnPopupSettings(false)
    }

    function clickYes(): void {
        setOnMsgCancelTreatment(true)
        setOnPopupSettings(false)
    }

    function cancelOnMsgCancelPatient(): void {
        setOnMsgCancelTreatment(false)
    }

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            {onPopupSettings && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={cancelPopupSetting}
                        title='Cancel patient registration?'
                        classIcon='text-font-color-2'
                        iconPopup={faBan}
                    >
                        <Button
                            nameBtn="Yes"
                            classBtn="hover:bg-white"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.5rem',
                                marginRight: '0.6rem',
                                marginTop: '0.5rem'
                            }}
                            clickBtn={clickYes}
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
                classEditBtn={`bg-orange-young border-orange-young hover:bg-orange hover:border-orange ${loadingCancelTreatment && 'cursor-not-allowed'}`}
                classTitle="border-none"
                styleHeadTop={{
                    padding: '0'
                }}
                classDeleteBtn="hidden"
                editIcon={loadingCancelTreatment ? undefined : faBan}
                classLoadingEdit={loadingCancelTreatment ? 'flex' : 'hidden'}
                clickEdit={clickCancelTreatment}
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
                        id="specialist"
                        data={optionsSpecialist}
                        handleSelect={() => handleSelect('specialist')}
                    />
                    <ErrorInput
                        error={errInputValue?.specialist}
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Choose Doctor"
                    />
                    <InputSelect
                        id="doctor"
                        data={optionsDoctor}
                        handleSelect={() => handleSelect('doctor')}
                    />
                    <ErrorInput
                        error={errInputValue?.doctor}
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Room Name"
                    />
                    <InputSelect
                        id="roomName"
                        data={optionsRoom}
                        handleSelect={() => handleSelect('roomName')}
                    />
                    <ErrorInput
                        error={errInputValue?.roomName}
                    />
                    <div
                        className="flex flex-wrap justify-end"
                    >
                        <Toggle
                            idToggle="setAutoRoom"
                            labelText="Set auto room"
                            classWrapp="mt-2"
                            clickToggle={clickToggleAutoRoom}
                        />
                    </div>
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title="Practice Hours"
                    />
                    <Input
                        type="text"
                        nameInput="practiceHours"
                        valueInput={inputValue.practiceHours}
                        placeholder="08:00 - 10:00"
                        readonly={true}
                    />
                    <ErrorInput
                        error={errInputValue?.practiceHours}
                    />
                </CardInfo>

                <CardInfo
                    classWrapp="flex flex-col"
                >
                    <TitleInput
                        title={`Treatment Hours`}
                    />
                    <Input
                        type="text"
                        nameInput="treatmentHours"
                        valueInput={inputValue.treatmentHours}
                        placeholder="08:00 - 10:00"
                        readonly={true}
                    />
                    <ErrorInput
                        error={errInputValue?.treatmentHours}
                    />
                </CardInfo>
            </InputContainer>

            <div
                className="flex w-full justify-center"
            >
                <Button
                    nameBtn="CONFIRM PATIENT"
                    classBtn={`${loadingSubmit ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'} px-4`}
                    classLoading={`${loadingSubmit ? 'flex' : 'hidden'}`}
                    clickBtn={submitConfirmation}
                />
            </div>
        </Container>
    )
}

export default FormRegistrationData