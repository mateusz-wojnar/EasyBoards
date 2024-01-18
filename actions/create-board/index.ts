"use server"

import { db } from "@/lib/db"
import { InputType, ReturnType } from "./types"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateBoard } from "./schema"

//handler

const handler = async (data:InputType): Promise<ReturnType> => {
    const {userId} = auth()

    if (!userId) {
        return {
            error : "Unauthorized"
        }
    }

    const {title} = data

    let board

    try {
        throw new Error("costam")
        board = await db.board.create({
            data: {
                title,
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