import JsPDF from 'jspdf'
import { FormatPDFT, UnitPDFT } from 'lib/types/InputT.type';

export const UsePDF = (
    element: HTMLElement | string,
    patientName: string,
    format: FormatPDFT,
    unit: UnitPDFT
)=>{
    const doc = new JsPDF({
        format: format,
        unit: unit,
        orientation: 'p',
        putOnlyUsedFonts:true
    });
    
    doc.setFont('times', 'bold', '800')
    doc.setLineHeightFactor(0.7)

    doc.html(element, {
        callback: function(doc){
            doc.save(`patient-registration-information-${patientName}.pdf`)
        }
    })

    return
}