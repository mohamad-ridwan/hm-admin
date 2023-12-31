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
        cb?: (id: string, p2?: boolean, p3?: string) => void,
        cb2?: (p1?: boolean) => void
    ) => void
    changeDateConfirm: (
        e: ChangeEvent<HTMLInputElement> | Date | undefined, inputName: string
    )=>void
    loadDataDoctor: (specialist: string, isActiveDoctor?: boolean, appointmentDate?: string)=>void
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
    idPatientToEditConfirmPatient: string | null
    idLoadingEditConfirmPatient: string[]
    disableToggleQueue: boolean
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
    // selectPresence,
    idPatientToEditConfirmPatient,
    idLoadingEditConfirmPatient,
    submitEditConfirmPatient,
    disableToggleQueue
}: Props) {

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const isLoadingEdit = idLoadingEditConfirmPatient.find(id=>id === idPatientToEditConfirmPatient)

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
                    readonly={true}
                    styles={{
                        background: '#f9f9f9'
                    }}
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
                    handleSelect={() => handleInputSelectConfirmPatient('selectSpecialist', 'doctorSpecialist', (id, p2, p3) => loadDataDoctor(id, p2, p3), (p1) => loadDataRoom(p1))}
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
                    styles={{
                        background: editActiveManualQueue ? '#f9f9f9' : 'transparent'
                    }}
                />
                <ErrorInput
                    error={errEditInputConfirmPatient?.queueNumber}
                />
                {/* options */}
                {disableToggleQueue === false && (
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
                )}

                <TitleInput title='Treatment Hours (08:00 - 12:00)' />
                <Input
                    type='text'
                    nameInput='treatmentHours'
                    changeInput={changeEditConfirmPatient}
                    valueInput={valueInputEditConfirmPatient?.treatmentHours}
                    readonly={true}
                    styles={{
                        background:'#f9f9f9'
                    }}
                />
                <ErrorInput
                    {...styleError}
                    error={errEditInputConfirmPatient?.treatmentHours}
                />

                <Button
                    nameBtn="UPDATE"
                    classLoading={isLoadingEdit ? 'flex' : 'hidden'}
                    classBtn={isLoadingEdit ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditConfirmPatient}
                />
            </FormPopup>
        </ContainerPopup>
    )
}

export default EditPatientConfirmation