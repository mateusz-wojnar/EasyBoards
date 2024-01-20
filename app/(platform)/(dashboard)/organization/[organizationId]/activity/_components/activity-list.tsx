import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"
import { ActivityItem } from "@/components/activity-item"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export const ActivityList = async () => {
    const {orgId} = auth()

    if (!orgId) {
        redirect("/select-org")
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgId
        },
        orderBy: {
            createdAt: "desc",
        },
    })

    

    return (
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
                There are no any activity logs in this organization.
            </p>
            {auditLogs.map((log) =>(
                <ActivityItem key={log.id} data={log}/>
            ))}
        </ol>               
    )
}

ActivityList.Skeleton = function ActivityListSkeleton() {
    return (
        <ol className="w-[300px]">
            <Skeleton  className="w-[80%] h-14 mb-2"/>
            <Skeleton  className="w-[70%] h-14 mb-2"/>
            <Skeleton  className="w-[50%] h-14 mb-2"/>
            <Skeleton  className="w-[60%] h-14 mb-2"/>
            <Skeleton  className="w-[75%] h-14 mb-2"/>
        </ol>
    )
}