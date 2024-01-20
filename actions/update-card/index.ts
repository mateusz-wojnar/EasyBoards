"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { UpdateCard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {id, boardId, ...values} = data
    let card

    //only the user with proper orgid can update the card in proper list
    try {
        card = await db.card.update({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
            data: {
                ...values,
            },
        })
    } catch (error) {
        return {
            error: "Failed to update."
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: card}
}

export const updateCard = createSafeAction(UpdateCard, handler)