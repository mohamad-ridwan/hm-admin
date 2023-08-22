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
        <thead
        // className={`flex w-full border-b-2 border-b-color-default ${classWrapp}`}
        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        >
            <tr>
            {data?.map((item, index)=>{
                return(
                    <th
                    key={index}
                    id={`${id}${index}`}
                    // className={`flex text-start text-sm py-[15px] px-[20px] w-[calc(100%/7)] ${classHeadName}`}
                    scope="col" className="px-6 py-3"
                    >
                        {item.name}
                    </th>
                )
            })}
            </tr>
        </thead>
    )
}