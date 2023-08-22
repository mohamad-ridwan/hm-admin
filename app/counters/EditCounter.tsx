import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputEditCounterT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";

type ActionProps = {
    clickCloseEditCounter: () => void
    changeInputEditCounter: (e: ChangeEvent<HTMLInputElement>) => void
    submitEditCounter: ()=>void
}

type Props = ActionProps & {
    counterName: string
    inputEditCounter: InputEditCounterT
    errInputEditCounter: InputEditCounterT
    loadingIdEditCounter: string[]
    idEditCounter: string
}

export function EditCounter({
    clickCloseEditCounter,
    counterName,
    changeInputEditCounter,
    inputEditCounter,
    errInputEditCounter,
    loadingIdEditCounter,
    idEditCounter,
    submitEditCounter
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const loadingSubmitEditCounter = loadingIdEditCounter.find(id=>id === idEditCounter)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickCloseEditCounter}
                title="Counter"
                namePatient={counterName}
            >
                <TitleInput title='Counter Name' />
                <Input
                    type='text'
                    nameInput='loketName'
                    placeholder="C.A.."
                    changeInput={changeInputEditCounter}
                    valueInput={inputEditCounter.loketName}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.loketName}
                />

                <Button
                    nameBtn="Edit Counter"
                    classLoading={loadingSubmitEditCounter ? 'flex' : 'hidden'}
                    classBtn={loadingSubmitEditCounter ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditCounter}
                />
            </FormPopup>
        </ContainerPopup>
    )
}