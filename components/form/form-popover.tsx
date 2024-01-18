"use client"

import { ElementRef, useRef } from "react"
import {toast} from "sonner"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/use-action"
import { createBoard } from "@/actions/create-board"
import { FormInput } from "./form-input"
import { FormSubmit } from "./form-submit"
import { FormPicker } from "./form-picker"

interface FormPopoverProps {
    children: React.ReactNode
    side?: "left" | "right" | "top" | "bottom"
    align?: "start" | "center" | "end"
    sideOffset?: number
}

export const FormPopover = ({
    children,
    side = "bottom",
    align,
    sideOffset = 0
}: FormPopoverProps) => {
    const router = useRouter()
    
    // to closeRef closes the popover after succesfull board creation
    const closeRef = useRef<ElementRef<"button">>(null)

    const {execute, fieldErrors} = useAction(createBoard, {
        onSuccess: (data) => {
            toast.success("Board Created !")
            closeRef.current?.click()
            router.push(`/board/${data.id}`)
        },
        onError: (error) => {
            toast.error(error)
        }
    })

    const onSubmit = (formData: FormData) => {
        const title = formData.get("title") as string
        const image = formData.get("image") as string

        execute({title,image})
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent
                align={align}
                className="w-80 pt-3"
                side={side}
                sideOffset={sideOffset}
            >
                <div className="text-sm font-medium text-center text-neutral-600 pb-4">
                    Create board
                </div>
                <PopoverClose ref={closeRef} asChild>
                    <Button
                        className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600 border-0"
                        variant="ghost"
                    >
                        <X className="h-4 w-4"/>
                    </Button>
                </PopoverClose>
                <form action={onSubmit}>
                    <div className="space-y-4">
                        <FormPicker
                            id="image"
                            errors={fieldErrors}
                        />
                        <FormInput
                            id="title"
                            label="Board Title"
                            type="text"
                            errors={fieldErrors}
                        />
                        <FormSubmit className="w-full" >
                            Create
                        </FormSubmit>
                    </div>
                </form>
            </PopoverContent>
        </Popover>
    )
}