"use server"

import { db } from "@/lib/db"
import { InputType, ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateBoard } from "./schema"

//handler

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error : "Unauthorized"
        }
    }

    const {title, image} = data

    const [
        imageId,
        imageThumbUrl,
        imageFullUrl,
        imageLinkHTML,
        imageUserName
    ] = image.split("|") //split image data by pipe

    if (!imageId || !imageThumbUrl || !imageFullUrl || !imageLinkHTML || !imageUserName) {
        return {
            error: "Missing fields. Failed to create board."
        }
    }

    let board

    try {
        board = await db.board.create({
            data: {
                title,
                orgId,
                imageId,
                imageThumbUrl,
                imageFullUrl,
                imageUserName,
                imageLinkHTML
            }
        })
    } catch (error) {
        return {
            error: "DB error"
        }
    }

    revalidatePath(`/board/${board.id}`)
    return {data: board}
}

export const createBoard = createSafeAction(CreateBoard,handler)