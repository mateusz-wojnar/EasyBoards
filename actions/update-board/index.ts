"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { UpdateBoard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {title, id} = data
    let board

    //only the user with proper id and orgid can update the board
    try {
        board = await db.board.update({
            where: {
                id,
                orgId,
            },
            data: {
                title
            }
        })
    } catch (error) {
        return {
            error: "Failed to update."
        }
    }

    revalidatePath(`/board/${id}`)
    return {data: board}
}

export const updateBoard = createSafeAction(UpdateBoard, handler)