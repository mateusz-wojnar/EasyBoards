"use client"

import { useEdgeStore } from "@/lib/edgestore"
import Link from "next/link"
import { useState } from "react"

const FilesPage = () => {
    const [file, setFile] = useState<File>()
    const [progress, setProgress] = useState(0)
    const [urls, setUrls] = useState<{
        url: string,
        thumbnailUrl: string | null
    }>()

    const {edgestore} = useEdgeStore()

    return(
        <div className="w-full">
            <input 
                type="file" 
                onChange={(e) => {
                    setFile(e.target.files?.[0])
                }}
            />
            <div className="h-[8px] w-44 border rounded overflow-hidden">
                <div 
                    className="h-full bg-black transition-all duration-150"
                    style={{
                        width: `${progress}%`
                    }} 
                />
            </div>
            <button
                className="bg-white text-black rounded-md px-2 hover:opacity-80"
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
            </button>
            {urls?.url && <Link href={urls.url} target="_blank">URL </Link>}
            {urls?.thumbnailUrl && <Link href={urls.thumbnailUrl} target="_blank">THUMBNAIL</Link>}
        </div>
    )
}

export default FilesPage