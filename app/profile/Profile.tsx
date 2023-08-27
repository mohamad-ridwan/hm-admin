'use client'

import { CSSProperties } from "react"
import ImageInput from "components/input/ImageInput"
import defaultUser from 'images/user.webp'
import { UseProfile } from "./UseProfile"
import { TitleInput } from "components/input/TitleInput"
import Input from "components/input/Input"
import ErrorInput from "components/input/ErrorInput"
import Button from "components/Button"
import InputContainer from "components/input/InputContainer"
import { ContainerPopup } from "components/popup/ContainerPopup"
import { SettingPopup } from "components/popup/SettingPopup"

export function Profile() {
    const {
        clickOpenImage,
        getImgFile,
        inputValueProfile,
        errInputValueProfile,
        changeInput,
        submitUpdateProfile,
        deleteImg,
        imgStringUrl,
        isOnUpdate,
        loadingSubmit,
        onModalSettings
    } = UseProfile()

    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const isReadyToUpdate: string = isOnUpdate ? loadingSubmit ? 'cursor-not-allowed hover:bg-default hover:text-white' : 'hover:bg-white w-full' : 'cursor-not-allowed hover:bg-default hover:text-white'
    const isLoading: string = loadingSubmit ? 'flex' : 'hidden'

    return (
        <div
            className="flex justify-center items-center shadow-sm bg-white py-8 px-6 mx-1 my-8 rounded-md"
        >
            {onModalSettings?.title && (
                <ContainerPopup
                    className='flex justify-center items-center overflow-y-auto'
                >
                    <SettingPopup
                        clickClose={onModalSettings.clickClose}
                        title={onModalSettings.title}
                        classIcon={onModalSettings.classIcon}
                        iconPopup={onModalSettings.iconPopup}
                    >
                        {onModalSettings.actionsData.length > 0 && onModalSettings.actionsData.map((btn, idx) => {
                            return (
                                <Button
                                    key={idx}
                                    nameBtn={btn.nameBtn}
                                    classBtn={btn.classBtn}
                                    classLoading={btn.classLoading}
                                    clickBtn={btn.clickBtn}
                                    styleBtn={btn.styleBtn}
                                />
                            )
                        })}
                    </SettingPopup>
                </ContainerPopup>
            )}

            <InputContainer
                tag='div'
                className="flex flex-col w-[300px] max-w-[600px]"
            >
                <ImageInput
                    src={imgStringUrl.length > 0 ? imgStringUrl : defaultUser}
                    nameInput="image"
                    height={300}
                    width={300}
                    alt="admin medical admin"
                    clickImg={clickOpenImage}
                    changeInput={getImgFile}
                    styleWrappImg={{
                        height: '7rem',
                        width: '7rem'
                    }}
                />
                {imgStringUrl.length > 0 && (
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
                <div
                    className="mt-[50px] mb-[20px]"
                >
                    <TitleInput title='Name' />
                    <Input
                        type='text'
                        nameInput='name'
                        changeInput={changeInput}
                        valueInput={inputValueProfile.name}
                    />
                    <ErrorInput
                        {...styleError}
                        error={errInputValueProfile?.name}
                    />

                    <TitleInput title='Email' />
                    <Input
                        type='email'
                        nameInput='email'
                        changeInput={changeInput}
                        valueInput={inputValueProfile.email}
                        readonly={true}
                        styles={{
                            background: '#f9f9f9'
                        }}
                    />
                    <ErrorInput
                        {...styleError}
                        error={errInputValueProfile?.email}
                    />
                </div>
                <Button
                    nameBtn='UPDATE PROFILE'
                    classLoading={isLoading}
                    classBtn={isReadyToUpdate}
                    clickBtn={submitUpdateProfile}
                />
            </InputContainer>
        </div>
    )
}