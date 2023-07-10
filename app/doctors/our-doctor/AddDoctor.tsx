import { CSSProperties, ChangeEvent } from "react";
import ErrorInput from "components/input/ErrorInput";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { AddNewDoctorT } from "lib/types/InputT.type";
import ImageInput from "components/input/ImageInput";
import defaultDoctor from 'images/user.png'
import Button from "components/Button";
import { CardAddMedsos } from "components/medsos/CardAddMedsos";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type ErrInputAddDoctor = {
    image: string
    name: string
    deskripsi: string
    medsos: string
    doctorSchedule: string
    holidaySchedule: string
}

type ActionProps = {
    clickClosePopupEdit: () => void
    clickOpenImage: () => void
    getImgFile: (e: ChangeEvent<HTMLInputElement>) => void
    deleteImg: () => void
    changeInputAddDoctor: (e: ChangeEvent<HTMLInputElement>) => void
    onAddMedsos: ()=>void
}

type Props = ActionProps & {
    inputValueAddDoctor: AddNewDoctorT
    errInputAddDoctor: ErrInputAddDoctor
}

export function AddDoctor({
    clickClosePopupEdit,
    errInputAddDoctor,
    clickOpenImage,
    getImgFile,
    inputValueAddDoctor,
    deleteImg,
    changeInputAddDoctor,
    onAddMedsos
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const currentImg = !inputValueAddDoctor.image ? defaultDoctor : inputValueAddDoctor.image

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickClosePopupEdit}
                title="Added a new doctor"
            >
                <TitleInput title='Image' />
                <ImageInput
                    src={currentImg}
                    nameInput="image"
                    height={80}
                    width={80}
                    alt="doctor photo hospice medical admin"
                    clickImg={clickOpenImage}
                    changeInput={getImgFile}
                />
                {/* <Input
                    type='text'
                    nameInput='patientName'
                    changeInput={changeEditDetailPatient}
                    valueInput={valueInputEditDetailPatient.patientName}
                /> */}
                {/* <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.image}
                /> */}
                {inputValueAddDoctor.image.length > 0 && (
                    <div
                        className="flex justify-center"
                    >
                        <Button
                            nameBtn="DELETE"
                            clickBtn={deleteImg}
                            classBtn="text-[0.55rem] rounded-sm hover:bg-pink-old hover:text-white hover:border-pink-old"
                            classLoading="hidden"
                            styleBtn={{
                                padding: '0.4rem',
                                marginTop: '0.5rem',
                            }}
                        />
                    </div>
                )}

                <TitleInput title='Doctor Name' />
                <Input
                    type='text'
                    nameInput='name'
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.name}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.name}
                />

                <TitleInput title='Doctor Specialist' />
                <Input
                    type='text'
                    nameInput='deskripsi'
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.deskripsi}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.deskripsi}
                />

                <TitleInput title='Social Media' />
                <div
                className="flex flex-wrap justify-between"
                >
                    {inputValueAddDoctor.medsos.length > 0 && inputValueAddDoctor.medsos.map((item, index)=>{
                        const medsosName = item.medsosName === 'twitter' ? faTrash : faTrash
                        return(
                            <CardAddMedsos
                            key={index}
                            icon={medsosName}
                            socialMediaLinks={item.path}
                            socialMediaName={item.medsosName}
                            nameIcon={item.nameIcon}
                            id={item.id}
                            />
                        )
                    })}
                </div>
                <Button
                nameBtn='Add social media'
                classLoading="hidden"
                classBtn="hover:bg-white"
                clickBtn={onAddMedsos}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.medsos}
                />
            </FormPopup>
        </ContainerPopup>
    )
}