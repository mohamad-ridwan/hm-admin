import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputAddCounterT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";

type ActionProps = {
    clickCloseAddCounter: () => void
    changeInputAddCounter: (e: ChangeEvent<HTMLInputElement>) => void
    submitAddCounter: () => void
    selectAddCounter: (
        e: ChangeEvent<HTMLSelectElement>,
        nameInput: 'counterType' | 'roomActive',
        elementId: 'addOptCounterType' | 'addOptRoomActive'
    ) => void
}

type Props = ActionProps & {
    inputAddCounter: InputAddCounterT
    errInputAddCounter: InputAddCounterT
    loadingSubmitAddCounter: boolean
    counterTypeOpt: DataOptionT
    roomActiveOpt: DataOptionT
}

export function AddCounter({
    clickCloseAddCounter,
    changeInputAddCounter,
    inputAddCounter,
    errInputAddCounter,
    loadingSubmitAddCounter,
    submitAddCounter,
    counterTypeOpt,
    selectAddCounter,
    roomActiveOpt
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
                clickClose={clickCloseAddCounter}
                title="Add Counter"
            >
                <TitleInput title='Counter Name' />
                <Input
                    type='text'
                    nameInput='loketName'
                    placeholder="C.A.."
                    changeInput={changeInputAddCounter}
                    valueInput={inputAddCounter.loketName}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddCounter?.loketName}
                />

                <TitleInput title='Counter Type' />
                <InputSelect
                    data={counterTypeOpt}
                    id="addOptCounterType"
                    handleSelect={(e) => {
                        if (typeof e !== 'undefined') {
                            selectAddCounter(e, 'counterType', 'addOptCounterType')
                        }
                    }}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddCounter?.counterType}
                />

                <TitleInput title='Room Active' />
                <InputSelect
                    data={roomActiveOpt}
                    id="addOptRoomActive"
                    handleSelect={(e) => {
                        if (typeof e !== 'undefined') {
                            selectAddCounter(e, 'roomActive', 'addOptRoomActive')
                        }
                    }}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddCounter?.roomActive}
                />

                <Button
                    nameBtn="Add Counter"
                    classLoading={loadingSubmitAddCounter ? 'flex' : 'hidden'}
                    classBtn={loadingSubmitAddCounter ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitAddCounter}
                />
            </FormPopup>
        </ContainerPopup>
    )
}