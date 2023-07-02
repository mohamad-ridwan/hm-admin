import { ChangeEvent } from "react"

type SelectProps = {
    id?: string
    handleSelect?: (e?: ChangeEvent<HTMLSelectElement>) => void
    classWrapp?: string
}

type OptionProps = {
    data: {
        id: string
        title: string
    }[]
}

type Props = SelectProps & OptionProps

export function InputSelect({
    id,
    handleSelect,
    classWrapp,
    data
}: Props) {
    return (
        <select
            name=""
            id={id}
            onChange={handleSelect}
            className={`bg-gray-search text-sm p-2 cursor-pointer outline-none ${classWrapp}`}
        >
            {data?.map((item, index) => (
                <option
                    key={index}
                    value={item?.id}
                    className="text-sm"
                >
                    {item?.title}
                </option>
            ))}
        </select>
    )
}