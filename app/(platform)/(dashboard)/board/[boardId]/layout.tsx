import { auth } from "@clerk/nextjs"
import { notFound, redirect } from "next/navigation"

import { db } from "@/lib/db"


// function to generate title based on board user is in
export async function generateMetadata({
    params
}: {
    params: {boardId: string}
}) {
    const {orgId} = auth()

    if (!orgId) {
        return {
            title: "Board",
        }
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        }
    })

    return {
        title: board?.title || "Board"
    }
}

const BoardIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode
    params: {boardId: string}
}) => {
    const {orgId} = auth()

    if (!orgId) {
        redirect('/select-org')
    }

    const board = await db.board.findUnique({
        where: {
            id: params.boardId,
            orgId,
        },
    })

    //if board not found for some reason throw 404 not found
    if (!board) {
        notFound
    }

    return (
        <div
            className="relative h-full bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${board?.imageFullUrl})`}}
        >
            <main className=" relative pt-28 h-full">
                {children}
            </main>
        </div>
    )
}

export default BoardIdLayout