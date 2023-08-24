import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputAddRoomT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";

type ActionProps = {
    clickCloseEditRoom: () => void
    changeEditRoom: (e: ChangeEvent<HTMLInputElement>) => void
    handleSubmitUpdate: () => void
    selectRoomType: () => void
    changeDateEditRoom: (
        e?: ChangeEvent<HTMLInputElement> | Date,
        nameInput?: 'procurementDate'
    ) => void
    selectRoomActive: ()=>void
}

type Props = ActionProps & {
    roomName: string
    inputEditRoom: InputAddRoomT
    errInputEditRoom: InputAddRoomT
    loadingIdEditRoom: string[]
    editIdRoom: string | null
    roomTypeOptions: DataOptionT
    roomActiveOptions: DataOptionT
}

export function EditRoom({
    clickCloseEditRoom,
    changeEditRoom,
    roomName,
    inputEditRoom,
    errInputEditRoom,
    loadingIdEditRoom,
    editIdRoom,
    handleSubmitUpdate,
    roomTypeOptions,
    selectRoomType,
    changeDateEditRoom,
    roomActiveOptions,
    selectRoomActive
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const loadingEdit = loadingIdEditRoom.find(id => id === editIdRoom)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickCloseEditRoom}
                title="Room"
                namePatient={roomName}
            >
                <TitleInput title='Room Name' />
                <Input
                    type='text'
                    nameInput='room'
                    changeInput={changeEditRoom}
                    valueInput={inputEditRoom.room}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.room}
                />

                <TitleInput title='Room Type' />
                <InputSelect
                    data={roomTypeOptions}
                    id="editSelectRoomType"
                    handleSelect={selectRoomType}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.roomType}
                />

                <TitleInput title='Procurement Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputEditRoom.procurementDate ? undefined : new Date(inputEditRoom.procurementDate)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateEditRoom(e, 'procurementDate')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.procurementDate}
                />

                <TitleInput title='Procurement Hours' />
                <Input
                    type='text'
                    nameInput='procurementHours'
                    changeInput={changeEditRoom}
                    valueInput={inputEditRoom.procurementHours}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.procurementHours}
                />

                <TitleInput title='Room Active' />
                <InputSelect
                    data={roomActiveOptions}
                    id="roomActiveOpt"
                    handleSelect={selectRoomActive}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.roomActive as string}
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