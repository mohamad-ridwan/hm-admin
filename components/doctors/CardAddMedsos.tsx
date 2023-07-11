import { faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type ActionProps = {
    deleteMedsos: ()=>void
}

type IconProps = {
    elementIcon: string | TrustedHTML
}

type Props = ActionProps & IconProps & {
    socialMediaName: string
    nameIcon: string
    socialMediaLinks: string
    id: string
}

export function CardAddMedsos({
    socialMediaLinks,
    nameIcon,
    socialMediaName,
    id,
    elementIcon,
    deleteMedsos
}: Props) {
    function RenderIconSvg({element}: {element: string | TrustedHTML}){
        return <p dangerouslySetInnerHTML={{__html: element}} 
        className="mr-1 text-[0.75rem]"
        ></p>
    }

    return (
        <div
        className="flex flex-col bg-white shadow-md rounded-sm p-4 m-1"
        >
            <div
                className="flex flex-wrap justify-between"
            >
                <div
                className="flex items-center"
                >
                    <RenderIconSvg
                        element={elementIcon}
                    />

                    <span
                    className="text-[0.75rem]"
                    >{socialMediaName}</span>
                </div>

                <button
                onClick={deleteMedsos}
                >
                    <FontAwesomeIcon
                        icon={faXmark}
                        className="text-red-default text-[0.8rem]"
                    />
                </button>
            </div>

            <div
            className="flex flex-col mt-2"
            >
                <a
                href={socialMediaLinks}
                target="_blank"
                className="text-[0.75rem] cursor-pointer border-b-[1px] border-b-bdr-bottom"
                >{socialMediaLinks}</a>
                <span
                className="text-[0.75rem]"
                >{nameIcon}</span>
                <span
                className="text-[0.75rem]"
                >{id}</span>
            </div>
        </div>
    )
}