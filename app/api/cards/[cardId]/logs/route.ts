import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { ENTITY_TYPE } from "@prisma/client";

export async function GET(
    request: Request,
    {params}: {params: {cardId: string}}
) {
    try {
        const {userId, orgId} = auth()

        if (!userId || !orgId) {
            return new NextResponse("Unathorized", {status: 401})
        }

        const auditLogs = await db.auditLog.findMany({
            where: {
                orgId,
                entityId: params.cardId,
                entityType: ENTITY_TYPE.CARD,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 3, // top 3
        })
        
        return NextResponse.json(auditLogs)
    } catch (error) {
        return new NextResponse("Internal Error", {status: 500})
    }
}