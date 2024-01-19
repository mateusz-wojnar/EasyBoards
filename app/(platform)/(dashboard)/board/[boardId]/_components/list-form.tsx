"use client"

import { Plus, X } from "lucide-react"
import { useState, useRef, ElementRef } from "react"
import { useEventListener, useOnClickOutside } from "usehooks-ts"
import { useParams } from "next/navigation"

import { ListWrapper } from "./list-wrapper"
import { FormSubmit } from "@/components/form/form-submit"
import { FormInput } from "@/components/form/form-input"
import { Button } from "@/components/ui/button"

export const ListForm = () => {    
    const params = useParams()

    const formRef = useRef<ElementRef<"form">>(null)
    const inputRef = useRef<ElementRef<"input">>(null)

    const [isEditing, setIsEditing] = useState(false)

    const enableEditing = () => {
        setIsEditing(true)
        setTimeout(() => {
            inputRef.current?.focus()
        })
    }

    const disableEditing = () => {
        setIsEditing(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
        if (e.key ==="Escape") {
            disableEditing()
        }
    }

    //listeners for pressing key and clicking outside form
    useEventListener("keydown",onKeyDown)
    useOnClickOutside(formRef,disableEditing)

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
                >
                    <FormInput
                        ref={inputRef}
                        id="title"
                        className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
                        placeholder="Enter List title..."
                    />
                    <input
                        hidden
                        value={params.boardId}
                        name="boardId"
                    />
                    <div className="flex items-center gap-x-1">
                        <FormSubmit>
                            Add List
                        </FormSubmit>
                        <Button 
                            onClick={disableEditing}
                            size="sm"
                            variant="ghost"
                            className="ml-auto"
                        >
                            <X className="h-5 w-5"/>
                        </Button>
                    </div>
                </form>

            </ListWrapper>
        )
    }

    return (
        <ListWrapper>
            <button
                onClick={enableEditing}
                className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-xs"
            >
                <Plus className="h-4 w-4 mr-2"/>
                Add a list
            </button>
        </ListWrapper>
    )
}