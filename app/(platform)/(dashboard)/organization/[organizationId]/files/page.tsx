

import { SingleImageDropzone } from "@/components/ui/single-image-upload"
import { useEdgeStore } from "@/lib/edgestore"
import Link from "next/link"
import { useState } from "react"
import { Info } from "../_components/info"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "./_components/file-upload"
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


const FilesPage = () => {
    const {orgRole} = auth()

    if (orgRole === "org:member") {
        return (
            <div>
                <Info/>
                <Separator className="my-2"/>
                <p className="text-xl text-rose-600">Unauthorized access.</p>
            </div>
        )
    }


    return(

        <div className="w-full">
            <Info/>
            <Separator className="my-2"/>
            <FileUpload>

            </FileUpload>
        </div>
    )
}

export default FilesPage