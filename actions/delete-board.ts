"use server"

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";


// CRUD - DELETE 
export async function deleteBoard(id: string) {
    await db.board.delete({
        where: {
            id
        }
    })

    revalidatePath("/organization/org_2b3E06cwBGIGIyubTmcCrihmS1K")
}