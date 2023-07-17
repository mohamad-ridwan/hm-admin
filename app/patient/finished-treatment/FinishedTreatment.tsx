'use client'

import { ContainerTableBody } from "components/table/ContainerTableBody"
import { TableBody } from "components/table/TableBody"
import { FilterTable } from "./FilterTable"
import { TableHead } from "components/table/TableHead"
import { TableColumns } from "components/table/TableColumns"
import { TableData } from "components/table/TableData"
import { TableFilter } from "components/table/TableFilter"
import { InputSearch } from "components/input/InputSearch"
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import { InputSelect } from "components/input/InputSelect"

export function FinishedTreatment() {
    const {
        head,
        dataColumns,
        searchText,
        handleSearchText,
        closeSearch,
        statusOptions,
        handleStatus,
        filterBy,
        handleFilterBy,
        sortOptions,
        handleSort,
        currentFilterBy
    } = FilterTable()

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
                    </>
                }
                rightChild={
                    <>
                        <InputSelect
                            id='statusFilter'
                            classWrapp='mt-2'
                            data={statusOptions}
                            handleSelect={handleStatus}
                        />

                        <InputSelect
                            id='filterBy'
                            classWrapp='mt-2'
                            data={filterBy}
                            handleSelect={handleFilterBy}
                        />

                        <InputSelect
                            id='sortBy'
                            classWrapp='mt-2'
                            data={sortOptions}
                            handleSelect={handleSort}
                        />
                    </>
                }
            />

            <ContainerTableBody>
                <TableBody
                    style={{
                        width: '1400px'
                    }}
                >
                    <TableHead
                        data={head}
                        id='tHead'
                    />

                    {dataColumns.length > 0 ? dataColumns.map((patient, index) => {
                        return (
                            <TableColumns
                                key={index}
                                clickBtn={() => ''}
                                clickEdit={(e) => {
                                    e?.stopPropagation()
                                }}
                                clickDelete={(e) => {
                                    e?.stopPropagation()
                                }}
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
        </>
    )
}