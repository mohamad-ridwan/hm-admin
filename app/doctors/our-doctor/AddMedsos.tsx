import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { MedsosDoctorT } from "lib/types/DoctorsT.types";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";

type ActionProps = {
    onAddMedsos: () => void
    submitAddMedsos: () => void
    changeInputAddMedsos: (e: ChangeEvent<HTMLInputElement>) => void
}

type Props = ActionProps & {
    inputAddMedsos: MedsosDoctorT
    errInputAddMedsos: MedsosDoctorT
}

export function AddMedsos({
    onAddMedsos,
    inputAddMedsos,
    errInputAddMedsos,
    submitAddMedsos,
    changeInputAddMedsos
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
                clickClose={onAddMedsos}
                title="Add social media"
            >
                <TitleInput title='Social Media ID' />
                <Input
                    type='text'
                    nameInput='id'
                    valueInput={inputAddMedsos.id}
                    readonly
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddMedsos?.id}
                />

                <TitleInput title='Name Icon' />
                <Input
                    type='text'
                    nameInput='nameIcon'
                    placeholder="fab fa-twitter"
                    valueInput={inputAddMedsos.nameIcon}
                    changeInput={changeInputAddMedsos}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddMedsos?.nameIcon}
                />

                <TitleInput title='Element Icon' />
                <Input
                    type='text'
                    nameInput='elementIcon'
                    placeholder="svg tag html"
                    valueInput={inputAddMedsos.elementIcon}
                    changeInput={changeInputAddMedsos}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddMedsos?.elementIcon}
                />

                <TitleInput title='Social Media links' />
                <Input
                    type='text'
                    nameInput='path'
                    placeholder="https://someone/twitter.com"
                    valueInput={inputAddMedsos.path}
                    changeInput={changeInputAddMedsos}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddMedsos?.path}
                />

                <TitleInput title='Social Media Name' />
                <Input
                    type='text'
                    nameInput='medsosName'
                    placeholder="twitter/facebook/instagram"
                    valueInput={inputAddMedsos.medsosName}
                    changeInput={changeInputAddMedsos}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddMedsos?.medsosName}
                />

                <Button
                    nameBtn='Add'
                    classLoading="hidden"
                    classBtn="hover:bg-white"
                    clickBtn={submitAddMedsos}
                />
            </FormPopup>
        </ContainerPopup>
    )
}