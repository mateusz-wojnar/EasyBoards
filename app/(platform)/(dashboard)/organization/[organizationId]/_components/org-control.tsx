"use client"

//active listening to url in browser to prevent copied link to redirect to wrong org

import { useOrganizationList } from "@clerk/nextjs"
import { useParams } from "next/navigation"
import { useEffect } from "react"

export const OrgControl = () => {
    const params = useParams()
    const {setActive} = useOrganizationList()

    useEffect(() => {
        if (!setActive) return

    setActive({
        organization: params.organizationId as string,
    })
    }, [setActive, params.organizationId])

    return null
}