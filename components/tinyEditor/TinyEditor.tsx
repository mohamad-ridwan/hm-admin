import { Dispatch, SetStateAction } from 'react'
import { Editor } from "@tinymce/tinymce-react";

type Props = {
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

export function TinyEditor({
    value,
    setValue
}: Props) {
    const apiKey: string = process.env.NEXT_PUBLIC_TINY_API_KEY as string

    return (
        <Editor
            value={value}
            apiKey={apiKey}
            onEditorChange={(newValue, editor)=>setValue(newValue)}
        />
    )
}