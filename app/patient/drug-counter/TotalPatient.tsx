type Props = {
    data: { title: string, total: number | string }[]
}

export function TotalPatient({
    data
}: Props) {
    return (
        <ul
        className="mt-8"
        >
            {data.length > 0 && data.map((item, index) => {
                return (
                    <li
                        key={index}
                        className="flex flex-wrap items-center my-2"
                    >
                        <span
                            className="text-font-color-2 text-sm mr-1"
                        >
                            {item.title} :
                        </span>
                        <span
                            className="text-pink-old text-sm font-semibold"
                        >
                            {item.total}
                        </span>
                    </li>
                )
            })}
        </ul>
    )
}