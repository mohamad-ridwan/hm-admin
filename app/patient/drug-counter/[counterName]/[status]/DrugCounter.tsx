'use client'

import { useRouter } from "next/navigation";
import { ContainerTableBody } from "components/table/ContainerTableBody";
import { TableBody } from "components/table/TableBody";
import { FilterTable } from "./FilterTable";
import { TableHead } from "components/table/TableHead";
import Pagination from "components/pagination/Pagination";
import { TableColumns } from "components/table/TableColumns";
import { TableData } from "components/table/TableData";
import { TableFilter } from "components/table/TableFilter";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/dates/renderCustomHeader";
import { InputSelect } from "components/input/InputSelect";
import { specialCharacter } from "lib/regex/specialCharacter";
import { spaceString } from "lib/regex/spaceString";
import { ActionsDataT } from "lib/types/TableT.type";

type ParamsProps = {
    params: {
        counterName: string
        status: string
    }
}

export function DrugCounter({ params }: ParamsProps) {
    const router = useRouter()

    const {
        head,
        currentPage,
        setCurrentPage,
        lastPage,
        maxLength,
        currentTableData,
        searchText,
        handleSearchText,
        closeSearch,
        displayOnCalendar,
        selectDate,
        closeDate,
        handleInputDate,
        filterBy,
        handleFilterBy,
        currentFilterBy,
        dataSortByFilter,
        handleSortCategory
    } = FilterTable({ params })

    return (
        <>
            {/* table filter */}
            <TableFilter
                leftChild={
                    <>
                        <InputSearch
                            icon={faMagnifyingGlass}
                            classWrapp='mt-2'
                            placeHolder='Search Text'
                            onCloseSearch={searchText.length > 0}
                            valueText={searchText}
                            changeInput={handleSearchText}
                            clickCloseSearch={closeSearch}
                        />
                        {displayOnCalendar && (
                            <InputSearch
                                icon={faCalendarDays}
                                classWrapp='mt-2'
                                placeholderText='Search Date'
                                onCalendar={true}
                                selected={selectDate}
                                onCloseSearch={selectDate !== undefined}
                                renderCustomHeader={renderCustomHeader}
                                clickCloseSearch={closeDate}
                                changeInput={handleInputDate}
                            />
                        )}
                    </>
                }
                rightChild={
                    <>
                        <InputSelect
                            id='filterBy'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterBy}
                        />
                        {
                            currentFilterBy.id !== 'Filter By' && (
                                <InputSelect
                                    id='sortByFilter'
                                    classWrapp='mt-2'
                                    data={dataSortByFilter}
                                    handleSelect={handleSortCategory}
                                />
                            )
                        }
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody style={{
                    width: '1500px'
                }}>
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {currentTableData.length > 0 ? currentTableData.map((patient, index) => {
                        const cleanName = patient.data[0]?.name.replace(specialCharacter, '')
                        const namePatient = cleanName.replace(spaceString, '')
                        const status = params?.status !== 'already-confirmed' ? 'not-yet-confirmed' : 'confirmed'
                        const queueNumber = patient.data[1].name

                        const pathUrlToDataDetail = `/patient/patient-registration/personal-data/confirmed/${namePatient}/${patient.id}/counter/${params?.counterName}/${status}/${queueNumber}`

                        const actionsData: ActionsDataT[] = [
                            {
                                name: 'Edit',
                                click: (e?: MouseEvent)=>{
                                    e?.stopPropagation()
                                }
                            },
                            {
                                name: 'Delete',
                                click: (e?: MouseEvent)=>{
                                    e?.stopPropagation()
                                }
                            }
                        ]

                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => router.push(pathUrlToDataDetail)}
                                actionsData={actionsData}
                                classWrappMenu="hidden"
                                // clickEdit={(e) => {
                                //     e?.stopPropagation()
                                // }}
                                // clickDelete={(e) => {
                                //     e?.stopPropagation()
                                // }}
                            >
                                {patient.data.map((item, idx) => {
                                    return (
                                        <TableData
                                            key={idx}
                                            id={`tData${index}${idx}`}
                                            name={item.name}
                                            firstDesc={item?.firstDesc}
                                            styleFirstDesc={{
                                                color: item?.color,
                                                marginBottom: item?.marginBottom
                                            }}
                                            styleName={{
                                                fontSize: item?.fontSize,
                                                fontWeight: item?.fontWeightName,
                                                color: item?.colorName
                                            }}
                                        />
                                    )
                                })}
                            </TableColumns>
                        )
                    }) : (
                        <div
                            className='flex justify-center'
                        >
                            <p
                                className='p-8'
                            >No patient registration data</p>
                        </div>
                    )}
                </TableBody>
            </ContainerTableBody>
            <div
                className='flex justify-end mt-4'
            >
                <Pagination
                    currentPage={currentPage}
                    lastPage={lastPage}
                    maxLength={maxLength}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </>
    )
}