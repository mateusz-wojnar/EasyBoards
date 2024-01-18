// form for renaming board in board navbar
"use client"

import { toast } from "sonner"
import { ElementRef, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Board } from "@prisma/client"
import { FormInput } from "@/components/form/form-input"
import { updateBoard } from "@/actions/update-board"
import { useAction } from "@/hooks/use-action"

interface BoardTitleFormProps {
    data: Board
}

export const BoardTitleForm = ({
    data,
}: BoardTitleFormProps) => {
    const {execute} = useAction(updateBoard, {
        onSuccess: (data) => {
            toast.success(`Board renamed to: "${data.title}"`)
            setTitle(data.title)
            disabledEditing()
        },
        onError: (error) => {
            toast.error(error)
        }
    })


    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    //extract title for optimistic updating
    const [title, setTitle] = useState(data.title)

    const [isEditing, setIsEditing] = useState(false)

    const enableEditing = () => {
        //TODO: focus inputs
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
            inputRef.current?.select()
        })
    }

    const disabledEditing = () => {
        setIsEditing(false)
    }

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        
        execute({
            title,
            id: data.id
        })
    }

    //causes clicking outside of input to fire submit
    const onBlur = () => {
        formRef.current?.requestSubmit()
    }

    if (isEditing) {
        return (
            <form action={onSubmit} ref={formRef} className="flex items-center gap-x-2">
                <FormInput
                    ref={inputRef}
                    id="title"
                    onBlur={onBlur}
                    defaultValue={title}
                    className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
                />
            </form>
        )
    }
    
    return (
        <Button
            onClick={enableEditing}
            variant="transparent"
            className="font-bold text-lg w-auto h-auto p-1 px-2" 
        >
            {title}
        </Button>
    )
}