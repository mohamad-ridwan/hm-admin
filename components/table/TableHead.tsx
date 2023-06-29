import { HeadDataTableT } from "lib/types/TableT.type"

type Props = {
    classWrapp?: string
    data: HeadDataTableT
    id: string
    classHeadName?: string
}

export function TableHead({
    classWrapp,
    data,
    id,
    classHeadName
}: Props){
    return(
        <div
        className={`flex w-full border-b-2 border-b-color-default ${classWrapp}`}
        >
            {data?.map((item, index)=>{
                return(
                    <li
                    key={index}
                    id={`${id}${index}`}
                    className={`flex text-start text-sm py-[15px] px-[20px] w-[calc(100%/7)] ${classHeadName}`}
                    >
                        {item.name}
                    </li>
                )
            })}
        </div>
    )
}