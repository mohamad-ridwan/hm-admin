'use client'

import { CSSProperties, ChangeEvent } from "react"
import ErrorInput from "components/input/ErrorInput"
import Input from "components/input/Input"
import { InputSelect } from "components/input/InputSelect"
import { TitleInput } from "components/input/TitleInput"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { FormPopup } from "components/popup/FormPopup"
import { Toggle } from "components/toggle/Toggle"
import { InputEditConfirmPatientT } from "lib/types/InputT.type"
import { DataOptionT } from "lib/types/FilterT"
import { InputSearch } from "components/input/InputSearch"
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons"
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader"
import Button from "components/Button"

type ActionProps = {
    closePopupEditConfirmPatient: () => void
    changeEditConfirmPatient: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    handleInputSelectConfirmPatient: (
        idElement: string,
        nameInput: 'emailAdmin' | 'doctorSpecialist' | 'nameDoctor' | 'roomName' | 'presence',
        cb?: (id: string, p2?: boolean) => void,
        cb2?: (p1?: boolean) => void
    ) => void
    changeDateConfirm: (
        e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string
    )=>void
    loadDataDoctor: (specialist: string, isActiveDoctor?: boolean)=>void
    loadDataRoom: (isActiveRoom?: boolean)=>void
    toggleChangeManualQueue: ()=>void
    toggleSetAutoQueue: ()=>void
    submitEditConfirmPatient: ()=>void
}

type Props = ActionProps & {
    valueInputEditConfirmPatient: InputEditConfirmPatientT
    nameEditConfirmPatient: string
    errEditInputConfirmPatient: InputEditConfirmPatientT
    selectEmailAdmin: DataOptionT
    selectDoctorSpecialist: DataOptionT
    selectDoctor: DataOptionT
    selectRoom: DataOptionT
    editActiveManualQueue: boolean
    selectPresence: DataOptionT
    idWaitToSubmitConfirmPatient: string[]
    idPatientToEditConfirmPatient: string | null
}

function EditPatientConfirmation({
    valueInputEditConfirmPatient,
    nameEditConfirmPatient,
    errEditInputConfirmPatient,
    closePopupEditConfirmPatient,
    changeEditConfirmPatient,
    selectEmailAdmin,
    handleInputSelectConfirmPatient,
    changeDateConfirm,
    selectDoctorSpecialist,
    loadDataDoctor,
    loadDataRoom,
    selectDoctor,
    selectRoom,
    editActiveManualQueue,
    toggleChangeManualQueue,
    toggleSetAutoQueue,
    selectPresence,
    idWaitToSubmitConfirmPatient,
    idPatientToEditConfirmPatient,
    submitEditConfirmPatient
}: Props) {

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    // on loading edit confirmation patient
    const findIdWaitSubmitConfirmPatient = idWaitToSubmitConfirmPatient.find(id => id === idPatientToEditConfirmPatient)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                title='Patient of'
                namePatient={nameEditConfirmPatient}
                clickClose={closePopupEditConfirmPatient}
            >
                <TitleInput title='Patient Id' />
                <Input
                    type='number'
                    nameInput='patientId'
                    changeInput={changeEditConfirmPatient}
                    valueInput={valueInputEditConfirmPatient?.patientId}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.patientId}
                />

                <TitleInput title='Email Admin' />
                <InputSelect
                    id='selectAdmin'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectEmailAdmin}
                    handleSelect={() => handleInputSelectConfirmPatient('selectAdmin', 'emailAdmin')}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.emailAdmin}
                />

                <TitleInput title='Confirmation Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!valueInputEditConfirmPatient?.dateConfirm ? undefined : new Date(valueInputEditConfirmPatient?.dateConfirm)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateConfirm(e, 'dateConfirm')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.dateConfirm}
                />

                <TitleInput title='Confirmation Hour' />
                <Input
                    type='text'
                    nameInput='confirmHour'
                    changeInput={changeEditConfirmPatient}
                    valueInput={valueInputEditConfirmPatient?.confirmHour}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.confirmHour}
                />

                <TitleInput title='Select Specialist' />
                <InputSelect
                    id='selectSpecialist'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectDoctorSpecialist}
                    handleSelect={() => handleInputSelectConfirmPatient('selectSpecialist', 'doctorSpecialist', (id, p2) => loadDataDoctor(id, p2), (p1) => loadDataRoom(p1))}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.doctorSpecialist}
                />

                <TitleInput title='Select Doctor' />
                <InputSelect
                    id='selectDoctor'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectDoctor}
                    handleSelect={() => handleInputSelectConfirmPatient('selectDoctor', 'nameDoctor')}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.nameDoctor}
                />

                <TitleInput title='Select Room' />
                <InputSelect
                    id='selectRoom'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectRoom}
                    handleSelect={() => handleInputSelectConfirmPatient('selectRoom', 'roomName')}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.roomName}
                />

                <TitleInput title='Queue Number' />
                <Input
                    type='number'
                    nameInput='queueNumber'
                    changeInput={changeEditConfirmPatient}
                    valueInput={valueInputEditConfirmPatient?.queueNumber}
                    readonly={editActiveManualQueue}
                />
                <ErrorInput
                    error={errEditInputConfirmPatient?.queueNumber}
                />
                {/* options */}
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
                        idToggle='setAutoNumber'
                        clickToggle={toggleSetAutoQueue}
                    />
                </div>

                <TitleInput title='Treatment Hours (08:00 - 12:00)' />
                <Input
                    type='text'
                    nameInput='treatmentHours'
                    changeInput={changeEditConfirmPatient}
                    valueInput={valueInputEditConfirmPatient?.treatmentHours}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.treatmentHours}
                />

                <TitleInput title='Presence' />
                <InputSelect
                    id='selectPresence'
                    classWrapp='bg-white mt-2 border-bdr-one border-color-young-gray'
                    data={selectPresence}
                    handleSelect={() => handleInputSelectConfirmPatient('selectPresence', 'presence')}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.presence}
                />

                <Button
                    nameBtn="UPDATE"
                    classLoading={findIdWaitSubmitConfirmPatient ? 'flex' : 'hidden'}
                    classBtn={findIdWaitSubmitConfirmPatient ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditConfirmPatient}
                />
            </FormPopup>
        </ContainerPopup>
    )
}

export default EditPatientConfirmation