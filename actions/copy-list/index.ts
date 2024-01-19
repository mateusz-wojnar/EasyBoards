"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { InputType, ReturnType } from "./types"
import { CopyList } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {id, boardId} = data
    let list

    //only the userwith proper orgid can delete the list in proper boardId
    try {
        //find the exact list to copy
        const listToCopy = await db.list.findUnique({
            where: {
                id,
                boardId,
                board: {
                    orgId,
                },
            },
            include: {
                cards: true,
            }
        })

        if (!listToCopy) {
            return {error: "List not found."}
        }

        //find the last list in board
        const lastList = await db.list.findFirst({
            where: {boardId},
            orderBy: {order: 'desc'},
            select: {order: true},
        })


        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                boardId: listToCopy.boardId,
                title: `${listToCopy.title} - Copy`,
                order: newOrder,
                cards: {
                    createMany: {
                        data: listToCopy.cards.map((card) => ({
                            title: card.title,
                            description: card.description,
                            order: card.order,
                        })),
                    },
                },
            },
            include: {
                cards: true
            },
        })

    } catch (error) {
        return {
            error: "Failed to copy."
        }
    }

    revalidatePath(`/organization/${boardId}`)
    return {data: list}
}

export const copyList = createSafeAction(CopyList , handler)