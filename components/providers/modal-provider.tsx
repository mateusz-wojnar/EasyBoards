"use client"

import { CardModal } from "@/components/modals/card-modal"
import { useEffect, useState } from "react"

export const ModalProvider = () => {
    //protect from hydration errors
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }


    return (
        <>
            <CardModal/>
        </>
    )
}