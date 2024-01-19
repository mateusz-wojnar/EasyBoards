"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"

import { InputType, ReturnType } from "./types"
import { db } from "@/lib/db"
import { createSafeAction } from "@/lib/create-safe-action"
import { CreateList } from "./schema"

const handler = async (data: InputType): Promise<ReturnType> => {
    const {userId, orgId} = auth()

    if (!userId || !orgId) {
        return {
            error: "Unathorized"
        }
    }

    const {title, boardId} = data
    let list


    try {
        
        const board = await db.board.findUnique({
            where: {
                id: boardId,
                orgId
            },
        })
        //prevents from creating a list in board that does not exist
        if (!board) {
            return {
                error: "Board not found"
            }
        }

        const lastList = await db.list.findFirst({
            where: {boardId: boardId},
            orderBy: {order: "desc"},
            select: {order: true},
        })

        // newOrder = if lastL:List exists set order to lastList.order + 1 / otherwise set order to 1 
        const newOrder = lastList ? lastList.order + 1 : 1

        list = await db.list.create({
            data: {
                title,
                boardId,
                order: 1
            }
        })
    } catch (error) {
        return {
            error: "Failed to create."
        }
    }

    revalidatePath(`/board/${boardId}`)
    return {data: list}
}

export const createList = createSafeAction(CreateList, handler)