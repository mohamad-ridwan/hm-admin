'use client'

import { CSSProperties, ChangeEvent} from "react";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { TitleInput } from "components/input/TitleInput";
import Input from "components/input/Input";
import ErrorInput from "components/input/ErrorInput";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import { InputArea } from "components/input/InputArea";
import Button from "components/Button";
import { InputEditPatientRegistrationT } from "lib/types/InputT.type";

type ActionProps = {
    clickClosePopupEdit: ()=>void
    changeEditDetailPatient: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    changeDateEditDetailPatient: (e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string) => void
    handleSubmitUpdate: ()=>void
}

type Props = {
    valueInputEditDetailPatient: InputEditPatientRegistrationT
    patientName: string | null
    errEditInputDetailPatient: InputEditPatientRegistrationT
    idPatientToEdit: string | null
    idLoadingEdit: string []
}

function EditPatientRegistration({
    valueInputEditDetailPatient,
    clickClosePopupEdit,
    patientName,
    changeEditDetailPatient,
    errEditInputDetailPatient,
    changeDateEditDetailPatient,
    handleSubmitUpdate,
    idPatientToEdit,
    idLoadingEdit
}: Props & ActionProps) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const loadingEdit = idLoadingEdit?.find(loadingId=> loadingId === idPatientToEdit)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickClosePopupEdit}
                title="Patient of"
                namePatient={patientName as string}
            >
                <TitleInput title='Patient Name' />
                <Input
                    type='text'
                    nameInput='patientName'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient.patientName}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.patientName}
                />

                <TitleInput title='Phone' />
                <Input
                    type='number'
                    nameInput='phone'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient?.phone}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.phone}
                />

                <TitleInput title='Email' />
                <Input
                    type='email'
                    nameInput='emailAddress'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient?.emailAddress}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.emailAddress}
                />

                <TitleInput title='Date of Birth' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!valueInputEditDetailPatient?.dateOfBirth ? undefined : new Date(valueInputEditDetailPatient?.dateOfBirth)}
                    onCalendar={true}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateEditDetailPatient(e, 'dateOfBirth')}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.dateOfBirth}
                />

                <TitleInput title='Appointment Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!valueInputEditDetailPatient?.appointmentDate ? undefined : new Date(valueInputEditDetailPatient?.appointmentDate)}
                    renderCustomHeader={renderCustomHeader}
                    onCalendar={true}
                    changeInput={(e) => changeDateEditDetailPatient(e, 'appointmentDate')}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.appointmentDate}
                />

                <TitleInput title='Message' />
                <InputArea
                    nameInput='message'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient?.message}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.message}
                />

                <TitleInput title='Patient Complaints' />
                <InputArea
                    nameInput='patientComplaints'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient?.patientComplaints}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.patientComplaints}
                />

                <TitleInput title='Submission Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!valueInputEditDetailPatient?.submissionDate ? undefined : new Date(valueInputEditDetailPatient?.submissionDate)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateEditDetailPatient(e, 'submissionDate')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.submissionDate}
                />

                <TitleInput title='Clock' />
                <Input
                    type='text'
                    nameInput='clock'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient?.clock}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputDetailPatient?.clock}
                />

                <Button
                    nameBtn="UPDATE"
                    classLoading={loadingEdit ? 'flex' : 'hidden'}
                    classBtn={loadingEdit ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={handleSubmitUpdate}
                />
            </FormPopup>
        </ContainerPopup>
    )
}

export default EditPatientRegistration