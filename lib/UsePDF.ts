import { jsPDF } from 'jspdf'

export const UsePDF = (
    element: HTMLElement,
    patientName: string
)=>{
    const doc = new jsPDF({
        format: 'a4',
        unit: 'px'
    });

    doc.html(element, {
        callback: function(doc){
            doc.save(`patient-registration-information-${patientName}.pdf`)
        }
    })

    return
}