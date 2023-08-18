import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputAddCounterT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";

type ActionProps = {
    clickCloseAddCounter: () => void
    changeInputAddCounter: (e: ChangeEvent<HTMLInputElement>) => void
    submitAddCounter: ()=>void
}

type Props = ActionProps & {
    inputAddCounter: InputAddCounterT
    errInputAddCounter: InputAddCounterT
    loadingSubmitAddCounter: boolean
}

export function AddCounter({
    clickCloseAddCounter,
    changeInputAddCounter,
    inputAddCounter,
    errInputAddCounter,
    loadingSubmitAddCounter,
    submitAddCounter
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