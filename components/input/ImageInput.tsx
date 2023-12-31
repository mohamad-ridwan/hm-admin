import { CSSProperties, ChangeEvent } from "react";
import Image, { StaticImageData } from "next/image"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-solid-svg-icons'
import Input from "./Input";

type ImgProps = {
    height?: number
    width?: number
    src: string | StaticImageData
    alt?: string
    styleWrappImg?: CSSProperties
}

type ButtonProps = ImgProps & {
    clickImg: (e?: MouseEvent) => void
}

type InputProps = ButtonProps & {
    changeInput: (e: ChangeEvent<HTMLInputElement>) => void
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
    valueInput,
    alt = 'user image hospice medical admin',
    styleWrappImg
}: Props) {
    return (
        <div
            className="flex justify-center mb-2"
        >
            <div
                className="flex justify-center overflow-hidden relative h-20 w-20"
                style={styleWrappImg}
            >
                <Image
                    src={src}
                    alt={alt}
                    height={height}
                    width={width}
                    className="flex object-cover rounded-full border-[3.5px] border-[#f1f1f1]"
                />
                <button
                    onClick={() => clickImg()}
                    className="flex justify-center items-center rounded-full h-9 w-9 shadow-sm absolute bottom-0 right-0 bg-color-default text-white z-10"
                >
                    <FontAwesomeIcon icon={faImage} className="text-lg" />
                </button>
                <Input
                    id="inputImg"
                    type="file"
                    accept=".jpg, .jpeg, .png, .webp"
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