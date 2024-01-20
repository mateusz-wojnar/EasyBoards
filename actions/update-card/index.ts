"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { UpdateCard } from "./schema"
import { createAuditLog } from "@/lib/create-audit-log"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

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
        await createAuditLog({
            entityTitle: card.title,
            entityId: card.id,
            entityType: ENTITY_TYPE.CARD,
            action: ACTION.UPDATE,
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