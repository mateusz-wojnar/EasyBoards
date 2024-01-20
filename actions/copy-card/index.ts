"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { InputType, ReturnType } from "./types"
import { CopyCard } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {id, boardId} = data
    let card

    //only the userwith proper orgid can copy the card in proper list
    try {
        //find the proper card
        const cardToCopy = await db.card.findUnique({
            where: {
                id,
                list: {
                    board: {
                        orgId
                    },
                },
            },
        })

        if (!cardToCopy) {
            return {error: "Card not found"}
        }
        
        const lastCard = await db.card.findFirst({
            where: {listId: cardToCopy.listId},
            orderBy: {order: "desc"},
            select: {order: true}
        })

        const newOrder = lastCard ? lastCard.order + 1 : 1

        card = await db.card.create({
            data: {
                title: `${cardToCopy.title} - Copy`,
                description: cardToCopy.description,
                order: newOrder,
                listId: cardToCopy.listId,
            },
        })
    } catch (error) {
        return {
            error: "Failed to copy."
        }
    }

    revalidatePath(`/organization/${boardId}`)
    return {data: card}
}

export const copyCard = createSafeAction(CopyCard , handler)