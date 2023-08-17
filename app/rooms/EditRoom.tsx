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

type ActionProps = {
    clickCloseEditRoom: () => void
    changeEditRoom: (e: ChangeEvent<HTMLInputElement>) => void
    handleSubmitUpdate: () => void
    selectRoomType: ()=>void
}

type Props = ActionProps & {
    roomName: string
    inputEditRoom: InputAddRoomT
    errInputEditRoom: InputAddRoomT
    loadingIdEditRoom: string[]
    editIdRoom: string | null
    roomTypeOptions: DataOptionT
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
    selectRoomType
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
                {/* <Input
                    type='text'
                    nameInput='roomType'
                    changeInput={changeEditRoom}
                    valueInput={inputEditRoom.roomType}
                /> */}
                <InputSelect
                    data={roomTypeOptions}
                    id="editSelectRoomType"
                    handleSelect={selectRoomType}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditRoom?.roomType}
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