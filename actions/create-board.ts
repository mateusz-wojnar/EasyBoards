"use server"

// for parsing data
import {z} from "zod"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

//set title to string
const CreateBoard = z.object({
    title: z.string()
})

 // CREATE BOARD - PUSH TO DB - POST - CRUD - C
export async function create(formData: FormData) {
    const {title} = CreateBoard.parse({
        title: formData.get("title")
    })

    await db.board.create({
        data: {
            title,
        }
    })

    revalidatePath("/organization/org_2b3E06cwBGIGIyubTmcCrihmS1K")
}