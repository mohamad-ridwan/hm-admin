import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputAddPatientT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";
import { InputArea } from "components/input/InputArea";
import Button from "components/Button";

type ActionProps = {
    clickCloseAddPatient: () => void
    changeInputAddPatient: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    changeDateAddPatient: (
        e: ChangeEvent<HTMLInputElement> | Date | undefined,
        inputName: 'dateOfBirth' | 'appointmentDate'
    ) => void
    handleSelectAddPatient: (
        idElement: 'dayAddPatient',
        nameInput: 'selectDay'
    ) => void
    submitAddPatient: () => void
    filterDate: (date: Date)=>number | boolean | undefined
}

type Props = ActionProps & {
    inputAddPatient: InputAddPatientT
    errInputAddPatient: InputAddPatientT
    optionsDay: DataOptionT
    minDateFormAddP: Date | undefined,
    maxDateFormAddP: Date | undefined
    loadingSubmitAddPatient: boolean
}

export function AddPatient({
    clickCloseAddPatient,
    changeInputAddPatient,
    inputAddPatient,
    errInputAddPatient,
    changeDateAddPatient,
    handleSelectAddPatient,
    optionsDay,
    submitAddPatient,
    minDateFormAddP,
    maxDateFormAddP,
    filterDate,
    loadingSubmitAddPatient
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickCloseAddPatient}
                title="Add Patient"
            >
                <TitleInput title='Patient Name' />
                <Input
                    type='text'
                    nameInput='patientName'
                    placeholder="Someone.."
                    changeInput={changeInputAddPatient}
                    valueInput={inputAddPatient.patientName}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.patientName}
                />

                <TitleInput title='Phone' />
                <Input
                    type='number'
                    nameInput='phone'
                    placeholder="081.."
                    changeInput={changeInputAddPatient}
                    valueInput={inputAddPatient.phone}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.phone}
                />

                <TitleInput title='Email' />
                <Input
                    type='email'
                    nameInput='emailAddress'
                    placeholder="someone@gmail.com"
                    changeInput={changeInputAddPatient}
                    valueInput={inputAddPatient.emailAddress}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.emailAddress}
                />

                <TitleInput title='Date of Birth' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputAddPatient.dateOfBirth ? undefined : new Date(inputAddPatient.dateOfBirth)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateAddPatient(e, 'dateOfBirth')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.dateOfBirth}
                />

                <TitleInput title='Select Day' />
                <InputSelect
                    id="dayAddPatient"
                    data={optionsDay}
                    classWrapp="bg-transparent border-bdr-one border-color-young-gray"
                    handleSelect={() => handleSelectAddPatient('dayAddPatient', 'selectDay')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.selectDay}
                />

                {inputAddPatient.selectDay !== 'Select Day' && (
                    <>
                        <TitleInput title='Appointment Date' />
                        <InputSearch
                            icon={faCalendarDays}
                            selected={!inputAddPatient.appointmentDate ? undefined : new Date(inputAddPatient.appointmentDate)}
                            renderCustomHeader={renderCustomHeader}
                            changeInput={(e) => changeDateAddPatient(e, 'appointmentDate')}
                            onCalendar={true}
                            classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                            classDate='text-[#000] text-sm'
                            minDate={minDateFormAddP}
                            maxDate={maxDateFormAddP}
                            filterDate={filterDate}
                        />
                        <ErrorInput
                            {...styleError}
                            error={errInputAddPatient?.appointmentDate}
                        />
                    </>
                )}

                <TitleInput title='Patient Complaints' />
                <InputArea
                    nameInput="patientComplaints"
                    changeInput={changeInputAddPatient}
                    valueInput={inputAddPatient.patientComplaints}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.patientComplaints}
                />

                <TitleInput title='Message' />
                <InputArea
                    nameInput="message"
                    changeInput={changeInputAddPatient}
                    valueInput={inputAddPatient.message}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddPatient?.message}
                />

                <Button
                    nameBtn="Add Patient"
                    classLoading={loadingSubmitAddPatient ? 'flex' : 'hidden'}
                    classBtn={loadingSubmitAddPatient ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitAddPatient}
                />
            </FormPopup>
        </ContainerPopup>
    )
}