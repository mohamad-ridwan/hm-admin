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
    headStyleRegis: CSSProperties
    styleWrappCounter: CSSProperties
    titleCounter: CSSProperties
    pageCounter: CSSProperties
    QRCode: CSSProperties
    titleTreatment: CSSProperties
}

export const PdfStyle: StyleType = {
    page: {
        display: 'flex',
        flexDirection: 'column',
        width: '400px',
        overflowX: 'auto',
        margin: '1rem'
    },
    headStyleRegis: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    img: {
        float: 'left',
        height: '40px',
        width: '40px',
        marginRight: '10px'
    },
    patient: {
        fontSize: '17px',
        whiteSpace: 'normal',
        letterSpacing: '0',
        fontWeight: 'bold'
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
        letterSpacing: '0',
        marginTop: '5px',
        fontWeight: 'bold'
    },
    cardInfo: {
        margin: '5px 0 5px 0',
        width: '45%'
    },
    titleInfo: {
        fontSize: '12px',
        whiteSpace: 'normal',
        letterSpacing: '0'
    },
    textInfo: {
        fontSize: '11px',
        whiteSpace: 'normal',
        letterSpacing: '0'
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
    },
    styleWrappCounter: {
        display: 'flex',
        flexDirection: 'column',
        height: '30mm',
        width: '100%',
        justifyContent:'center',
        alignItems: 'center',
    },
    titleCounter: {
        fontSize: '4mm',
        whiteSpace: 'normal',
        letterSpacing: '0',
        marginTop: '0mm',
        fontWeight: 'bold'
    },
    pageCounter: {
        display: 'flex',
        flexDirection: 'column',
        width: '27mm',
        overflowX: 'auto',
        margin: '0mm'
    },
    QRCode: {
        height: "auto", 
        maxWidth: "100%", 
        width: "10mm", 
        marginTop: '3mm'
    },
    titleTreatment:{
        fontSize: '18px',
        whiteSpace: 'normal',
        letterSpacing: '0',
        fontWeight: 'bold',
        marginBottom: '5px',
        color: '#555'
    }
}