'use client'

import { ChangeEvent, useState } from "react"
import { AddNewDoctorT } from "lib/types/InputT.type"
import { getImgValue } from "lib/actions/getImgValue"
import { MedsosDoctorT } from "lib/types/DoctorsT.types"
import { resolve } from "path"

type ErrInputAddDoctor = {
    image: string
    name: string
    deskripsi: string
    medsos: string
    doctorSchedule: string
    holidaySchedule: string
}

function FormAddDoctor(){
    const [onPopupAddDoctor, setOnPopupAddDoctor] = useState<boolean>(false)
    const [onPopupAddMedsos, setOnPopupAddMedsos] = useState<boolean>(false)
    const [inputValueAddDoctor, setInputValueAddDoctor] = useState<AddNewDoctorT>({
        image: '',
        name: '',
        deskripsi: '',
        medsos: [],
        doctorSchedule: [],
        holidaySchedule: []
    })
    const [inputAddMedsos, setInputAddMedsos] = useState<MedsosDoctorT>({
        id: '',
        nameIcon: '',
        path: '',
        medsosName: ''
    })
    const [errInputAddMedsos, setErrInputAddMedsos] = useState<MedsosDoctorT>({} as MedsosDoctorT)
    const [errInputAddDoctor, setErrInputAddDoctor] = useState<ErrInputAddDoctor>({} as ErrInputAddDoctor)

    function closePopupAddDoctor():void{
        setOnPopupAddDoctor(false)
    }

    function clickNewDoctor():void{
        setOnPopupAddDoctor(true)
    }

    function clickOpenImage():void{
        document.getElementById('inputImg')?.click()
    }

    function getImgFile(e: ChangeEvent<HTMLInputElement>):void{
        const files = e.target.files
        getImgValue(files)
        .then(res=>{
            setInputValueAddDoctor({
                ...inputValueAddDoctor,
                image: res.url
            })

            // setImgFile(res.files[0])
        })
        .catch(err=>{
            alert(err)
        })
    }

    function deleteImg():void{
        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            image: ''
        })
    }

    function changeInputAddDoctor(e: ChangeEvent<HTMLInputElement>):void{
        setInputValueAddDoctor({
            ...inputValueAddDoctor,
            [e.target.name]: e.target.value
        })

        setErrInputAddDoctor({
            ...errInputAddDoctor,
            [e.target.name]: ''
        })
    }

    
    // action add medsos
    function onAddMedsos():void{
        if(onPopupAddMedsos === false){
            setInputAddMedsos({
                ...inputAddMedsos,
                id: `${new Date().getTime()}`
            })
        }
        setOnPopupAddMedsos(!onPopupAddMedsos)
    }

    function changeInputAddMedsos(e: ChangeEvent<HTMLInputElement>):void{
        setInputAddMedsos({
            ...inputAddMedsos,
            [e.target.name]: e.target.value
        })

        setErrInputAddMedsos({
            ...errInputAddMedsos,
            [e.target.name]: ''
        })
    }

    function submitAddMedsos():void{
        if(validateAddMedsos()){
            const medsos = inputValueAddDoctor.medsos
            medsos.push(inputAddMedsos)
            setInputValueAddDoctor({
                ...inputValueAddDoctor,
                medsos: medsos
            })

            setOnPopupAddMedsos(false)
        }
    }

    function validateAddMedsos(): string | undefined{
        let err: MedsosDoctorT = {} as MedsosDoctorT

        if(!inputAddMedsos.id.trim()){
            err.id = 'Must be required'
        }
        if(!inputAddMedsos.nameIcon.trim()){
            err.nameIcon = 'Must be required'
        }
        if(!inputAddMedsos.path.trim()){
            err.path = 'Must be required'
        }
        if(!inputAddMedsos.medsosName.trim()){
            err.medsosName = 'Must be required'
        }

        if(Object.keys(err).length !== 0){
            setErrInputAddMedsos(err)
            return
        }

        return 'success'
    }
    // end action add medsos

    return {
        onPopupAddDoctor,
        closePopupAddDoctor,
        clickNewDoctor,
        inputValueAddDoctor,
        errInputAddDoctor,
        clickOpenImage,
        getImgFile,
        deleteImg,
        changeInputAddDoctor,
        onAddMedsos,
        onPopupAddMedsos,
        inputAddMedsos,
        errInputAddMedsos,
        submitAddMedsos,
        changeInputAddMedsos
    }
}

export default FormAddDoctor