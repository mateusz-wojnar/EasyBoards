"use client"

import { ListWithCards } from "@/types"
import { useEffect, useState } from "react"
import {DragDropContext, Droppable} from "@hello-pangea/dnd"

import { ListForm } from "./list-form"
import { ListItem } from "./list-item"

interface ListContainerProps {
    data: ListWithCards[]
    boardId: string
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex,1)
    result.splice(endIndex, 0, removed)

    return result
}

export const ListContainer = ({
    data,
    boardId
}: ListContainerProps) => {
    const [orderedData, setOrderedData] = useState(data)

    //effect for ensuring optimistic updates
    useEffect(() => {
        setOrderedData(data)
    }, [data])
 
    
// DRAG N DROP FUNCTION
const onDragEnd = (result: any) => {
    const {destination, source, type} = result

    if (!destination) {
        return
    }

    // if dropped in the same position
    if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
    ) {
        return
    }

    // if list is moved
    if (type === "list") {
        const items = reorder(
            orderedData,
            source.index,
            destination.index,
        ).map((item, index) => ({...item, order: index}))

        setOrderedData(items)
        // TODO: trigger server action
    }

    //if card is moved
    if (type === "card") {
        let newOrededData = [...orderedData]

        //get source and destination list
        const sourceList = newOrededData.find(list => list.id === source.droppableId)
        const destinationList = newOrededData.find(list => list.id === destination.droppableId)

        //if source or dest list was not found
        if (!sourceList || !destinationList) {
            return
        }
        
        //check if cards exist on source list
        if (!sourceList.cards) {
            sourceList.cards = []
        }

        //check if cards exists on dest list
        if (!destinationList.cards) {
            destinationList.cards = []
        }

        //if card moved in the same list
        if (source.droppableId === destination.droppableId) {
            const reorderedCards = reorder(
                sourceList.cards,
                source.index,
                destination.index
            )

            reorderedCards.forEach((card, idx) => {
                card.order = idx
            })

            sourceList.cards = reorderedCards

            setOrderedData(newOrededData)
            //TODO: trigger server action
        //if card moved to another list
        } else {
            // remove card from source list
            const [movedCard] = sourceList.cards.splice(source.index, 1)

            //assign new listId to the moved card
            movedCard.listId = destination.droppableId

            //add card to dest list
            destinationList.cards.splice(destination.index, 0, movedCard)

            sourceList.cards.forEach((card, idx) => {
                card.order = idx
            })

            //update order of each card in dest list
            destinationList.cards.forEach((card, idx) =>{
                card.order = idx
            })

            setOrderedData(newOrededData)
            //TODO: trigger server action
        }

        

    }

}


    return (

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lists" type="list" direction="horizontal">
                {(provided) => (
                    <ol 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex gap-x-3 h-full"
                    >
                        {orderedData.map((list, index) => {
                            return (
                                <ListItem
                                    key={list.id}
                                    index={index}
                                    data={list}
                                />
                            )
                        })}
                        {provided.placeholder}
                        <ListForm />
                        <div className=" flex-shrink-0 w-1"/>
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}