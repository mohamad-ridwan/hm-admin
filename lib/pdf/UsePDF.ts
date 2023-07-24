import JsPDF from 'jspdf'
import { FormatPDFT, UnitPDFT } from 'lib/types/InputT.type';

export const UsePDF = (
    element: HTMLElement | string,
    patientName: string,
    format: FormatPDFT,
    unit: UnitPDFT,
    fileName?: string
)=>{
    const doc = new JsPDF({
        format: format,
        unit: unit,
        orientation: 'p',
    });
    
    doc.setFont('times', 'bold', '800')
    doc.setLineHeightFactor(0.7)

    doc.html(element, {
        callback: function(doc){
            doc.save(`${fileName}-${patientName}.pdf`)
        }
    })

    return
}