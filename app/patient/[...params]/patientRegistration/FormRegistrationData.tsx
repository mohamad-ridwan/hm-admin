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

function FormRegistrationData({params}: {params: string}) {
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
        {params}
    )

    return (
        <Container
            isNavleft={false}
            classWrapp="flex-col shadow-sm bg-white py-4 px-6 mx-1 my-8 rounded-md"
            maxWidth="auto"
        >
            <HeadInfo
                titleInfo="Form Confirmation"
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