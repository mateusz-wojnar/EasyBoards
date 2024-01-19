import { auth } from "@clerk/nextjs"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"
import { ListContainer } from "./_components/list-container"

interface BoardIdPageProps {
    params: {
        boardId: string
    }
}

const BoardIdPage = async ({
    params
}: BoardIdPageProps) => {
    const {orgId} = auth()

    if (!orgId) {
        redirect("/select-org")
    }

    //select all cards from lists and lists from board
    // SELECT list.*, cards.*
    // FROM list
    // LEFT JOIN cards ON list.id = cards.listId
    // WHERE list.boardId = 'your_board_id' AND list.board_orgId = 'your_org_id'
    // ORDER BY list."order" ASC, cards."order" ASC;
    const lists = await db.list.findMany({
        where: {
            boardId: params.boardId,
            //match the board's org id
            board: {
                orgId
            },
        },
        include: {
            cards: {
                orderBy: {
                    order: "asc"
                },
            },
        },
        orderBy: {
            order: "asc"
        }
    })

    return (
        <div className="p-4 h-full overflow-x-auto">
            <ListContainer
                boardId={params.boardId}
                data={lists}
            />
        </div>
    )
}

export default BoardIdPage