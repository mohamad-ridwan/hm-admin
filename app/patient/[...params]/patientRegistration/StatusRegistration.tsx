import { IconDefinition} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Props = {
    icon: IconDefinition
    title: string
    classText: string
}

export function StatusRegistration({
    icon,
    title,
    classText
}:Props) {
    return (
        <div
            className="flex justify-end overflow-hidden"
        >
            <div
                className={`flex flex-wrap items-center mt-6 ${classText}`}
            >
                <FontAwesomeIcon
                    icon={icon}
                    className="text-3xl mr-2 justify-end"
                />
                <h1
                    className="text-3xl font-semibold"
                >{title}</h1>
            </div>
        </div>
    )
}