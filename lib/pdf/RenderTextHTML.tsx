export function RenderTextHTML({ textInfo }: { textInfo: string }) {
    const checkList = textInfo?.replace('<ol', '<ol class="list-decimal list-inside"')

    return <div
        dangerouslySetInnerHTML={{ __html: checkList }}
    ></div>
}