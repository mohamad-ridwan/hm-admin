import { CSSProperties, ChangeEvent } from "react";
import ErrorInput from "components/input/ErrorInput";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputEditFinishTreatmentT } from "lib/types/InputT.type";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";
import Button from "components/Button";

type ActionProps = {
    clickClosePopupEditFT: () => void
    changeEditFT: (e: ChangeEvent<HTMLInputElement>) => void
    changeDateEditFT: (e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: 'dateConfirm') => void
    handleSelectEditFT: (
        idElement: 'adminEmailFT',
        nameInput: 'adminEmail'
    ) => void
    submitEditFinishTreatment:()=>void
}

type Props = ActionProps & {
    patientName: string
    errInputEditFinishTreatment: InputEditFinishTreatmentT
    inputEditFinishTreatment: InputEditFinishTreatmentT
    optionsAdminEmail: DataOptionT
    isPatientCanceled: boolean
    loadingIdSubmitEditFT: string[]
    idPatientEditFT: string | null
}

export function EditFinishTreatment({
    clickClosePopupEditFT,
    patientName,
    errInputEditFinishTreatment,
    changeEditFT,
    inputEditFinishTreatment,
    changeDateEditFT,
    handleSelectEditFT,
    optionsAdminEmail,
    isPatientCanceled,
    loadingIdSubmitEditFT,
    idPatientEditFT,
    submitEditFinishTreatment
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const isLoading = loadingIdSubmitEditFT.find(id => id === idPatientEditFT)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickClosePopupEditFT}
                title="Patient of"
                namePatient={patientName}
            >
                <TitleInput title='Patient ID' />
                <Input
                    type='number'
                    nameInput='patientId'
                    valueInput={inputEditFinishTreatment.patientId}
                    readonly={true}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditFinishTreatment?.patientId}
                />

                <TitleInput title='Confirmed Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputEditFinishTreatment.dateConfirm ? undefined : new Date(inputEditFinishTreatment.dateConfirm)}
                    onCalendar={true}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateEditFT(e, 'dateConfirm')}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditFinishTreatment?.dateConfirm}
                />

                <TitleInput title='Confirmed Hours' />
                <Input
                    type='text'
                    nameInput='confirmHour'
                    changeInput={changeEditFT}
                    valueInput={inputEditFinishTreatment.confirmHour}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditFinishTreatment?.confirmHour}
                />

                <TitleInput title='Admin Email' />
                <InputSelect
                    id="adminEmailFT"
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    handleSelect={() => handleSelectEditFT('adminEmailFT', 'adminEmail')}
                    data={optionsAdminEmail}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditFinishTreatment?.adminEmail}
                />

                {isPatientCanceled && (
                    <>
                        <TitleInput title='Message Cancelled' />
                        <Input
                            type='text'
                            nameInput='messageCancelled'
                            changeInput={changeEditFT}
                            valueInput={inputEditFinishTreatment.messageCancelled}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInputEditFinishTreatment?.messageCancelled}
                        />
                    </>
                )}

                <Button
                nameBtn="UPDATE"
                classLoading={isLoading ? 'flex' : 'hidden'}
                classBtn={isLoading ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                clickBtn={submitEditFinishTreatment}
                />
            </FormPopup>
        </ContainerPopup>
    )
}