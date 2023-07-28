import { CSSProperties, ChangeEvent, Dispatch, SetStateAction } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputEditPatientCounter } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";
import { TinyEditor } from "components/tinyEditor/TinyEditor";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import Button from "components/Button";
import { Toggle } from "components/toggle/Toggle";

type ActionProps = {
    closePopupEditPatientC: () => void
    changeEditPatientC: (e: ChangeEvent<HTMLInputElement>) => void
    handleSelectCounter: (
        idElement: 'selectCounterEdit' | 'selectAdminCounter',
        nameInput: 'loketName' | 'adminEmail'
    ) => void
    setValue: Dispatch<SetStateAction<string>>
    handleChangeDate: (
        e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: 'submissionDate'
    ) => void
    submitEditPatientCounter: () => void
    toggleChangeManualQueue: () => void
    toggleSetAutoQueue: () => void
}

type Props = ActionProps & {
    namePatient: string
    inputValueEditPatientC: InputEditPatientCounter
    errInputValueEditPatientC: InputEditPatientCounter
    selectCounter: DataOptionT
    selectEmailAdmin: DataOptionT
    value: string
    idToEditPatientCounter: string | null,
    loadingIdSubmitEditPatientC: string[]
    editActiveManualQueue: boolean
    isExpiredPatient: boolean
}

export function EditPatientCounter({
    namePatient,
    closePopupEditPatientC,
    changeEditPatientC,
    inputValueEditPatientC,
    errInputValueEditPatientC,
    selectCounter,
    selectEmailAdmin,
    handleSelectCounter,
    setValue,
    handleChangeDate,
    value,
    submitEditPatientCounter,
    idToEditPatientCounter,
    loadingIdSubmitEditPatientC,
    editActiveManualQueue,
    toggleChangeManualQueue,
    toggleSetAutoQueue,
    isExpiredPatient,
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const isLoadingEdit = loadingIdSubmitEditPatientC.find(id => id === idToEditPatientCounter)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                title='Patient of'
                namePatient={namePatient}
                clickClose={closePopupEditPatientC}
            >
                <TitleInput title='Patient Id' />
                <Input
                    type='number'
                    nameInput='patientId'
                    changeInput={changeEditPatientC}
                    valueInput={inputValueEditPatientC.patientId}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.patientId}
                />

                <TitleInput title='Select Counter' />
                <InputSelect
                    id='selectCounterEdit'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectCounter}
                    handleSelect={() => handleSelectCounter('selectCounterEdit', 'loketName')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.loketName}
                />

                <TitleInput title='Message' />
                <TinyEditor
                    value={value}
                    setValue={setValue}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.message}
                />

                <TitleInput title='Select Admin' />
                <InputSelect
                    id='selectAdminCounter'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectEmailAdmin}
                    handleSelect={() => handleSelectCounter('selectAdminCounter', 'adminEmail')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.adminEmail}
                />

                <TitleInput title='Submission Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputValueEditPatientC.submissionDate ? undefined : new Date(inputValueEditPatientC.submissionDate)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => handleChangeDate(e, 'submissionDate')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.submissionDate}
                />

                <TitleInput title='Submit Hour' />
                <Input
                    type='text'
                    nameInput='submitHour'
                    changeInput={changeEditPatientC}
                    valueInput={inputValueEditPatientC.submitHour}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.submitHour}
                />

                <TitleInput title='Queue Number' />
                <Input
                    type='number'
                    nameInput='queueNumber'
                    changeInput={changeEditPatientC}
                    valueInput={inputValueEditPatientC.queueNumber}
                    readonly={editActiveManualQueue}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputValueEditPatientC?.queueNumber}
                />
                {/* options */}
                {isExpiredPatient === false ? (
                    <div
                        className='flex flex-wrap justify-end items-center mb-4'
                    >
                        <Toggle
                            labelText='Change manually'
                            clickToggle={toggleChangeManualQueue}
                        />
                        <Toggle
                            labelText='Set auto number'
                            classWrapp='ml-2'
                            idToggle='setAutoNumberC'
                            clickToggle={toggleSetAutoQueue}
                        />
                    </div>
                ) : (
                    <ErrorInput
                        {...styleError}
                        error={`Can't update queue number because it expired`}
                    />
                )}

                <Button
                    nameBtn="UPDATE"
                    classLoading={isLoadingEdit ? 'flex' : 'hidden'}
                    classBtn={isLoadingEdit ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditPatientCounter}
                />
            </FormPopup>
        </ContainerPopup>
    )
}