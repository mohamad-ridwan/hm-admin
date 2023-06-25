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
    height = 80,
    width = 80,
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
            className="flex justify-center overflow-hidden relative h-20 w-20"
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
                className="flex justify-center items-center rounded-full h-8 w-8 shadow-sm absolute bottom-0 right-0 bg-color-default text-white z-10"
                >
                    <FontAwesomeIcon icon={faImage}/>
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