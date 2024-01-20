"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { InputType, ReturnType } from "./types"
import { DeleteCard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {id, boardId} = data
    let card

    //only the userwith proper orgid can delete the card in proper list
    try {
        card = await db.card.delete({
            where: {
                id,
                list: {
                    board: {
                        orgId,
                    },
                },
            },
        })
    } catch (error) {
        return {
            error: "Failed to delete."
        }
    }

    revalidatePath(`/organization/${boardId}`)
    return {data: card}
}

export const deleteCard = createSafeAction(DeleteCard , handler)