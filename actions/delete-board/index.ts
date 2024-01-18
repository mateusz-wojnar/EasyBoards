"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { DeleteBoard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {id} = data
    let board

    //only the user with proper id and orgid can delete the board
    try {
        board = await db.board.delete({
            where: {
                id,
                orgId,
            },
        })
    } catch (error) {
        return {
            error: "Failed to delete."
        }
    }

    revalidatePath(`/organization/${orgId}`)
    redirect(`/organization/${orgId}`)
}

export const deleteBoard = createSafeAction(DeleteBoard, handler)