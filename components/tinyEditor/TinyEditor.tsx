import { useEffect, Dispatch, SetStateAction } from 'react'
import { Editor } from "@tinymce/tinymce-react";
import { textToHtml } from 'lib/tinyEditor/textToHtml';

type Props = {
    initialText?: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

export function TinyEditor({
    initialText,
    value,
    setValue
}: Props) {
    const apiKey: string = process.env.NEXT_PUBLIC_TINY_API_KEY as string

    useEffect(()=>{
        setValue(initialText ?? '')
    }, [initialText])

    return (
        <Editor
            initialValue={textToHtml(initialText as string)}
            value={value}
            apiKey={apiKey}
            onEditorChange={(newValue, editor)=>setValue(newValue)}
        />
    )
}