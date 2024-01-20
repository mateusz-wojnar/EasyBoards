"use client"

import { Button } from "@/components/ui/button"
import { SingleImageDropzone } from "@/components/ui/single-image-upload"
import { useEdgeStore } from "@/lib/edgestore"
import Link from "next/link"
import { useState } from "react"

export const FileUpload = () => {
    const [file, setFile] = useState<File>()
    const [progress, setProgress] = useState(0)
    const [urls, setUrls] = useState<{
        url: string,
        thumbnailUrl: string | null
    }>()

    const {edgestore} = useEdgeStore()
    return(
        <div className="w-full">
            <SingleImageDropzone
                width={200}
                height={200}
                value={file}
                onChange={(file) => {
                setFile(file);
                }}
            />
            <div className="h-[8px] w-44 border rounded overflow-hidden">
                <div 
                    className="h-full bg-black transition-all duration-150 mx-2"
                    style={{
                        width: `${progress}%`
                    }} 
                />
            </div>
            <Button
                className="mt-2"
                onClick={async () => {
                    if (file) {
                        const res = await edgestore.myPublicImages.upload({
                            file,
                            onProgressChange: (progress) => {
                                setProgress(progress)
                            }
                        })
                        //save data optional
                        setUrls({
                            url: res.url,
                            thumbnailUrl: res.thumbnailUrl
                        })
                    }
                }}
            >
                Upload
            </Button>
            
            {urls?.url && <Link href={urls.url} target="_blank">URL </Link>}
            {urls?.thumbnailUrl && <Link href={urls.thumbnailUrl} target="_blank">THUMBNAIL</Link>}
        </div>
    )
}