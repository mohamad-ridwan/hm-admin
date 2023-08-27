import { CSSProperties, ChangeEvent } from "react";
import Input from "components/input/Input";
import { TitleInput } from "components/input/TitleInput";
import { ContainerPopup } from "components/popup/ContainerPopup";
import { FormPopup } from "components/popup/FormPopup";
import { InputEditCounterT } from "lib/types/InputT.type";
import ErrorInput from "components/input/ErrorInput";
import Button from "components/Button";
import { InputSearch } from "components/input/InputSearch";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { renderCustomHeader } from "lib/datePicker/renderCustomHeader";
import { InputSelect } from "components/input/InputSelect";
import { DataOptionT } from "lib/types/FilterT";

type ActionProps = {
    clickCloseEditCounter: () => void
    changeInputEditCounter: (e: ChangeEvent<HTMLInputElement>) => void
    submitEditCounter: () => void
    changeDateEditCounter: (
        e?: ChangeEvent<HTMLInputElement> | Date,
        nameInput?: 'procurementDate'
    ) => void
    selectEditCounter: (
        e: ChangeEvent<HTMLSelectElement>,
        nameInput: 'counterType' | 'roomActive',
        elementId: 'optCounterType' | 'optRoomActive'
    ) => void
}

type Props = ActionProps & {
    counterName: string
    inputEditCounter: InputEditCounterT
    errInputEditCounter: InputEditCounterT
    loadingIdEditCounter: string[]
    counterTypeOpt: DataOptionT
    idEditCounter: string
    roomActiveOpt: DataOptionT
}

export function EditCounter({
    clickCloseEditCounter,
    counterName,
    changeInputEditCounter,
    inputEditCounter,
    errInputEditCounter,
    loadingIdEditCounter,
    idEditCounter,
    submitEditCounter,
    changeDateEditCounter,
    counterTypeOpt,
    selectEditCounter,
    roomActiveOpt
}: Props) {
    const styleError: { style: CSSProperties } = {
        style: {
            marginBottom: '1rem'
        }
    }

    const loadingSubmitEditCounter = loadingIdEditCounter.find(id => id === idEditCounter)

    return (
        <ContainerPopup
            className='flex justify-center overflow-y-auto'
        >
            <FormPopup
                tag="div"
                clickClose={clickCloseEditCounter}
                title="Counter"
                namePatient={counterName}
            >
                <TitleInput title='Counter Name' />
                <Input
                    type='text'
                    nameInput='loketName'
                    placeholder="C.A.."
                    changeInput={changeInputEditCounter}
                    valueInput={inputEditCounter.loketName}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.loketName}
                />

                <TitleInput title='Counter Type' />
                <InputSelect
                    data={counterTypeOpt}
                    id="optCounterType"
                    handleSelect={(e) => {
                        if(typeof e !== 'undefined'){
                            selectEditCounter(e, 'counterType', 'optCounterType')
                        }
                    }}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.counterType}
                />

                <TitleInput title='Procurement Date' />
                <InputSearch
                    icon={faCalendarDays}
                    selected={!inputEditCounter.procurementDate ? undefined : new Date(inputEditCounter.procurementDate)}
                    renderCustomHeader={renderCustomHeader}
                    changeInput={(e) => changeDateEditCounter(e, 'procurementDate')}
                    onCalendar={true}
                    classWrapp='bg-white border-bdr-one border-color-young-gray hover:border-color-default'
                    classDate='text-[#000] text-sm'
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.procurementDate}
                />

                <TitleInput title='Procurement Hours' />
                <Input
                    type='text'
                    nameInput='procurementHours'
                    placeholder="08:00:00.."
                    changeInput={changeInputEditCounter}
                    valueInput={inputEditCounter.procurementHours}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.procurementHours}
                />

                <TitleInput title='Room Active' />
                <InputSelect
                    data={roomActiveOpt}
                    id="optRoomActive"
                    handleSelect={(e) => {
                        if(typeof e !== 'undefined'){
                            selectEditCounter(e, 'roomActive', 'optRoomActive')
                        }
                    }}
                />
                <ErrorInput
                    {...styleError}
                    error={errInputEditCounter?.roomActive}
                />

                <Button
                    nameBtn="Edit Counter"
                    classLoading={loadingSubmitEditCounter ? 'flex' : 'hidden'}
                    classBtn={loadingSubmitEditCounter ? 'hover:bg-color-default hover:text-white cursor-not-allowed' : 'hover:bg-white'}
                    clickBtn={submitEditCounter}
                />
            </FormPopup>
        </ContainerPopup>
    )
}