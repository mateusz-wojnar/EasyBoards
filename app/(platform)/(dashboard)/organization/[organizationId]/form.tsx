"use client"

import { FormInput } from "./form-input"
import { FormButton } from "./form-button"
import { useAction } from "@/hooks/use-action"
import { createBoard } from "@/actions/create-board"

export const Form = () => {
    const {execute, fieldErrors} = useAction(createBoard, {
        // all available callbacks from UseActionOptions
        onSuccess: (data) => {
            console.log(data, "SUCCES")
        },
        onError: (error) => {
            console.error(error)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title= formData.get('title') as string

        execute({title})
    }

    return (
        <form action={onSubmit}>
            <div className="flex flex-col space-y-2">
                <FormInput errors={fieldErrors} />
            </div>
            <FormButton/>
        </form>
    )
}