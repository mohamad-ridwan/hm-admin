import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputAddRoomT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";

type ActionProps = {
    clickCloseAddRoom: () => void
    changeInputAddRoom: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
    submitAddRoom: ()=>void
}

type Props = ActionProps & {
    inputAddRoom: InputAddRoomT
    errInputAddRoom: InputAddRoomT
    loadingSubmitAddRoom: boolean
}

export function AddRoom({
    clickCloseAddRoom,
    changeInputAddRoom,
    inputAddRoom,
    errInputAddRoom,
    loadingSubmitAddRoom,
    submitAddRoom
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
                clickClose={clickCloseAddRoom}
                title="Add Room"
            >
                <TitleInput title='Room Name' />
                <Input
                    type='text'
                    nameInput='room'
                    placeholder="SPA.A01.."
                    changeInput={changeInputAddRoom}
                    valueInput={inputAddRoom.room}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddRoom?.room}
                />

                <TitleInput title='Room Type' />
                <Input
                    type='text'
                    nameInput='roomType'
                    placeholder="Ruang Spesialis THT"
                    changeInput={changeInputAddRoom}
                    valueInput={inputAddRoom.roomType}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddRoom?.roomType}
                />

                <Button
                    nameBtn="Add Room"
                    classLoading={loadingSubmitAddRoom ? 'flex' : 'hidden'}
                    classBtn={loadingSubmitAddRoom ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitAddRoom}
                />
            </FormPopup>
        </ContainerPopup>
    )
}