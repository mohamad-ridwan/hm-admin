import JsPDF from 'jspdf'

export const UsePDF = (
    element: HTMLElement | string,
    patientName: string
)=>{
    const doc = new JsPDF({
        format: 'a4',
        unit: 'px',
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