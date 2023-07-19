import { CSSProperties } from "react"

type StyleType = {
    page: CSSProperties
    img: CSSProperties
    patient: CSSProperties
    borderPatient: CSSProperties
    titleRS: CSSProperties
    cardInfo: CSSProperties
    titleInfo: CSSProperties
    textInfo: CSSProperties
    styleHead: CSSProperties
    styleContainer: CSSProperties
}

export const PdfStyle: StyleType = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px',
        width: 'auto',
        margin: '1rem'
    },
    img: {
        float: 'left',
        height: '40px',
        width: '40px'
    },
    patient: {
        fontSize: '17px',
        whiteSpace: 'normal',
        letterSpacing: 'normal'
    },
    borderPatient: {
        height: '1px',
        width: '100%',
        background: '#f1f1f1',
        marginTop: '5px'
    },
    titleRS: {
        fontSize: '18px',
        whiteSpace: 'normal',
        letterSpacing: 'normal'
    },
    cardInfo: {
        margin: '5px 0 5px 0',
        width: '45%'
    },
    titleInfo: {
        fontSize: '12px',
        whiteSpace: 'normal',
        letterSpacing: 'normal'
    },
    textInfo: {
        fontSize: '11px',
        whiteSpace: 'normal',
        letterSpacing: 'normal'
    },
    styleHead: {
        display: 'none'
    },
    styleContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    }
}