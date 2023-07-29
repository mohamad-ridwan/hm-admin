'use client'

import { CSSProperties, ChangeEvent, Dispatch, SetStateAction } from "react"
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons"
import { InputSearch } from "components/input/InputSearch"
import { TitleInput } from "components/input/TitleInput"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { FormPopup } from "components/popup/FormPopup"
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import { ErrInputEditConfirmPatientCounter, InputEditConfirmPatientCounter } from "lib/types/InputT.type"
import ErrorInput from "components/input/ErrorInput"
import Input from "components/input/Input"
import { InputSelect } from "components/input/InputSelect"
import { DataOptionT } from "lib/types/FilterT"
import { TinyEditor } from "components/tinyEditor/TinyEditor"
import Button from "components/Button"

type ActionProps = {
    closePopupEditConfirmPatientC: () => void
    handleChangeDate: (e: Date | ChangeEvent<HTMLInputElement> | undefined, inputName: "dateConfirm") => void
    changeEditConfirmPatientC: (e: ChangeEvent<HTMLInputElement>) => void
    handleSelectCounterConfirmP: (
        idElement: 'adminEmail' | 'paymentMethod',
        nameInput: 'adminEmail' | 'paymentMethod'
    ) => void
    setValueMsgEditCounterConfP: Dispatch<SetStateAction<string>>
    submitEditCounterConfirmP:()=>void
}

type Props = ActionProps & {
    namePatient: string
    inputValueEditCounterConfirmP: InputEditConfirmPatientCounter
    errInputEditCounterConfirmP: ErrInputEditConfirmPatientCounter
    optionsAdminEmailEditCounterConfP: DataOptionT
    valueMsgEditCounterConfP: string
    paymentOptions: DataOptionT
    idEditCounterConfirmP: string | null
    loadingIdSubmitEditCounterConfirmP: string[]
}

export function EditConfirmCounterP({
    closePopupEditConfirmPatientC,
    namePatient,
    inputValueEditCounterConfirmP,
    errInputEditCounterConfirmP,
    handleChangeDate,
    changeEditConfirmPatientC,
    handleSelectCounterConfirmP,
    optionsAdminEmailEditCounterConfP,
    setValueMsgEditCounterConfP,
    valueMsgEditCounterConfP,
    paymentOptions,
    idEditCounterConfirmP,
    loadingIdSubmitEditCounterConfirmP,
    submitEditCounterConfirmP
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const isLoadingEdit = loadingIdSubmitEditCounterConfirmP.find(id => id === idEditCounterConfirmP)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                title='Patient of'
                namePatient={namePatient}
                clickClose={closePopupEditConfirmPatientC}
            >
                <TitleInput title='Confirmed Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputValueEditCounterConfirmP.dateConfirm ? undefined : new Date(inputValueEditCounterConfirmP.dateConfirm)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => handleChangeDate(e, 'dateConfirm')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounterConfirmP?.dateConfirm}
                />

                <TitleInput title='Confirmed Hours' />
                <Input
                    type='text'
                    nameInput='confirmHour'
                    changeInput={changeEditConfirmPatientC}
                    valueInput={inputValueEditCounterConfirmP.confirmHour}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounterConfirmP?.confirmHour}
                />

                <TitleInput title='Admin Email' />
                <InputSelect
                    id='adminEmail'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={optionsAdminEmailEditCounterConfP}
                    handleSelect={() => handleSelectCounterConfirmP('adminEmail', 'adminEmail')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounterConfirmP?.adminEmail}
                />

                <TitleInput title='Payment Method' />
                <InputSelect
                    id='paymentMethod'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={paymentOptions}
                    handleSelect={() => handleSelectCounterConfirmP('paymentMethod', 'paymentMethod')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounterConfirmP?.paymentMethod}
                />

                {inputValueEditCounterConfirmP.paymentMethod === 'BPJS' && (
                    <>
                        <TitleInput title='BPJS Number' />
                        <Input
                            type='number'
                            nameInput='bpjsNumber'
                            changeInput={changeEditConfirmPatientC}
                            valueInput={inputValueEditCounterConfirmP.bpjsNumber}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInputEditCounterConfirmP?.bpjsNumber}
                        />
                    </>
                )}

                {inputValueEditCounterConfirmP.paymentMethod === 'cash' && (
                    <>
                        <TitleInput title='Total Cost' />
                        <Input
                            type='number'
                            nameInput='totalCost'
                            changeInput={changeEditConfirmPatientC}
                            valueInput={inputValueEditCounterConfirmP.totalCost}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInputEditCounterConfirmP?.totalCost}
                        />
                    </>
                )}

                <TitleInput title='Message' />
                <TinyEditor
                    value={valueMsgEditCounterConfP}
                    setValue={setValueMsgEditCounterConfP}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounterConfirmP?.message}
                />

                <Button
                    nameBtn="UPDATE"
                    classLoading={isLoadingEdit ? 'flex' : 'hidden'}
                    classBtn={isLoadingEdit ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditCounterConfirmP}
                />
            </FormPopup>
        </ContainerPopup>
    )
}