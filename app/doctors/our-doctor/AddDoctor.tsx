import { CSSProperties, ChangeEvent } from "react";
import ErrorInput from "components/input/ErrorInput";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { AddNewDoctorT, ErrInputAddDoctor } from "lib/types/InputT.type";
import ImageInput from "components/input/ImageInput";
import defaultDoctor from 'images/user.webp'
import Button from "components/Button";
import { CardAddMedsos } from "components/doctors/CardAddMedsos";
import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardAddDoctorSchedule } from "components/doctors/CardAddDoctorSchedule";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";

type ActionProps = {
    clickClosePopupEdit: () => void
    clickOpenImage: () => void
    getImgFile: (e: ChangeEvent<HTMLInputElement>) => void
    deleteImg: () => void
    changeInputAddDoctor: (e: ChangeEvent<HTMLInputElement>) => void
    onAddMedsos: () => void
    deleteMedsos: (id: string) => void
    onAddDoctorSchedule: () => void
    deleteSchedule: (id: string) => void
    deleteHolidaySchedule: (id: string) => void
    onAddHolidaySchedule: () => void
    submitAddDoctor: () => void
    selectRoomDoctor: (
        nameInput: 'room' | 'doctorActive' | 'deskripsi',
        elementId: 'selectRoom' | 'selectActiveDoctor' | 'selectSpecialist'
    ) => void
    submitEditDoctor: () => void
}

type Props = ActionProps & {
    inputValueAddDoctor: AddNewDoctorT
    errInputAddDoctor: ErrInputAddDoctor
    loadingSubmitAddDoctor: boolean
    rooms: DataOptionT
    titleFormDoctor: { title: string, peopleName: string, btnName: string }
    idLoadingEdit: string[]
    idEditDoctor: string | null
    activeDoctor: DataOptionT
    doctorSpecialist: DataOptionT
}

export function AddDoctor({
    clickClosePopupEdit,
    errInputAddDoctor,
    clickOpenImage,
    getImgFile,
    inputValueAddDoctor,
    deleteImg,
    changeInputAddDoctor,
    onAddMedsos,
    deleteMedsos,
    onAddDoctorSchedule,
    deleteSchedule,
    deleteHolidaySchedule,
    onAddHolidaySchedule,
    submitAddDoctor,
    loadingSubmitAddDoctor,
    rooms,
    selectRoomDoctor,
    titleFormDoctor,
    submitEditDoctor,
    idLoadingEdit,
    idEditDoctor,
    activeDoctor,
    doctorSpecialist
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const currentImg = !inputValueAddDoctor.image ? defaultDoctor : inputValueAddDoctor.image

    const currentLoadingEdit = idLoadingEdit.find(id => id === idEditDoctor)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickClosePopupEdit}
                title={titleFormDoctor.title}
                namePatient={titleFormDoctor.peopleName}
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
                    placeholder="Dr. Someone.Sp.pda"
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.name}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.name}
                />

                <TitleInput title='Doctor Specialist' />
                {/* <Input
                    type='text'
                    nameInput='deskripsi'
                    placeholder="Spesialis THT"
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.deskripsi}
                /> */}
                <InputSelect
                    data={doctorSpecialist}
                    id="selectSpecialist"
                    handleSelect={()=>selectRoomDoctor('deskripsi', 'selectSpecialist')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.deskripsi}
                />

                <TitleInput title='Email' />
                <Input
                    type='text'
                    nameInput='email'
                    placeholder="doctor@gmail.com"
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.email}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.email}
                />

                <TitleInput title='Phone' />
                <Input
                    type='tel'
                    nameInput='phone'
                    placeholder="081..."
                    changeInput={changeInputAddDoctor}
                    valueInput={inputValueAddDoctor.phone}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.phone}
                />

                <TitleInput title='Room' />
                <InputSelect
                    data={rooms}
                    id="selectRoom"
                    handleSelect={()=>selectRoomDoctor('room', 'selectRoom')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.room}
                />

                <TitleInput title='Doctor Active' />
                <InputSelect
                    data={activeDoctor}
                    id="selectActiveDoctor"
                    handleSelect={()=>selectRoomDoctor('doctorActive', 'selectActiveDoctor')}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.doctorActive}
                />

                <div
                    className="flex flex-wrap justify-between"
                >
                    <TitleInput title='Social Media' />

                    <button
                        onClick={onAddMedsos}
                    >
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="text-lg text-color-default"
                        />
                    </button>
                </div>

                <div
                    className="flex flex-wrap"
                >
                    {inputValueAddDoctor.medsos.length > 0 && inputValueAddDoctor.medsos.map((item, index) => {
                        return (
                            <CardAddMedsos
                                key={index}
                                elementIcon={item.elementIcon}
                                socialMediaLinks={item.path}
                                socialMediaName={item.medsosName}
                                nameIcon={item.nameIcon}
                                id={item.id}
                                deleteMedsos={() => deleteMedsos(item.id)}
                            />
                        )
                    })}
                </div>
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.medsos}
                />

                <div
                    className="flex flex-wrap justify-between"
                >
                    <TitleInput title='Doctor Schedule' />

                    <button
                        onClick={onAddDoctorSchedule}
                    >
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="text-lg text-color-default"
                        />
                    </button>
                </div>
                <div
                    className="flex flex-wrap"
                >
                    {inputValueAddDoctor.doctorSchedule.length > 0 && inputValueAddDoctor.doctorSchedule.map((item, index) => {
                        return (
                            <CardAddDoctorSchedule
                                key={index}
                                dayName={item.dayName}
                                practiceHours={item.practiceHours}
                                id={item.id}
                                deleteSchedule={() => deleteSchedule(item.id)}
                            />
                        )
                    })}
                </div>
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.doctorSchedule}
                />

                <div
                    className="flex flex-wrap justify-between"
                >
                    <TitleInput title='Holiday Schedule' />

                    <button
                        onClick={onAddHolidaySchedule}
                    >
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className="text-lg text-color-default"
                        />
                    </button>
                </div>
                <div
                    className="flex flex-wrap"
                >
                    {inputValueAddDoctor.holidaySchedule.length > 0 && inputValueAddDoctor.holidaySchedule.map((item, index) => {
                        return (
                            <CardAddDoctorSchedule
                                key={index}
                                dayName={item.date}
                                id={item.id}
                                deleteSchedule={() => deleteHolidaySchedule(item.id)}
                            />
                        )
                    })}
                </div>
                <ErrorInput
                    {...styleError}
                    error={errInputAddDoctor?.holidaySchedule}
                />

                {!titleFormDoctor.peopleName && (
                    <Button
                        nameBtn='Add Doctor'
                        classLoading={loadingSubmitAddDoctor ? 'flex' : 'hidden'}
                        classBtn={loadingSubmitAddDoctor ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                        clickBtn={submitAddDoctor}
                    />
                )}
                {titleFormDoctor.peopleName.length > 0 && (
                    <Button
                        nameBtn='Edit'
                        classLoading={currentLoadingEdit ? 'flex' : 'hidden'}
                        classBtn={currentLoadingEdit ? 'hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                        clickBtn={submitEditDoctor}
                    />
                )}
            </FormPopup>
        </ContainerPopup>
    )
}