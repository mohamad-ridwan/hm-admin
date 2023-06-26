import Image, { StaticImageData } from "next/image"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faImage} from '@fortawesome/free-solid-svg-icons'
import Input from "./Input";
import { ChangeEvent } from "react";

type ImgProps = {
    height?: number
    width?: number
    src: string | StaticImageData
}

type ButtonProps = ImgProps & {
    clickImg: (e?: MouseEvent)=>void
}

type InputProps = ButtonProps & {
    changeInput: (e: ChangeEvent<HTMLInputElement>)=>void
    nameInput: string
    valueInput?: string | number | string[] | undefined
}

type Props = InputProps

export default function ImageInput({
    height = 100,
    width = 100,
    src,
    clickImg,
    changeInput,
    nameInput,
    valueInput
}: Props){
    return(
        <div
        className="flex justify-center mb-2"
        >
            <div
            className="flex justify-center overflow-hidden relative h-24 w-24"
            >
                <Image
                src={src}
                alt='user image hospice medical admin'
                height={height}
                width={width}
                className="flex object-cover rounded-full border-[3.5px] border-[#f1f1f1]"
                />
                <button
                onClick={()=>clickImg()}
                className="flex justify-center items-center rounded-full h-9 w-9 shadow-sm absolute bottom-0 right-0 bg-color-default text-white z-10"
                >
                    <FontAwesomeIcon icon={faImage} className="text-lg"/>
                </button>
                <Input
                id="inputImg"
                type="file"
                accept=".jpg, .jpeg, .png"
                nameInput={nameInput}
                changeInput={changeInput}
                valueInput={valueInput}
                styles={{
                    display: 'none'
                }}
                />
            </div>
        </div>
    )
}