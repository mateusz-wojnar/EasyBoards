//special type export to handle working with lists and cards 
//since they are strictly tied to each other in db schema

import { Card, List } from "@prisma/client";

export type ListWithCards = List & {cards: Card[]}

export type CardWithList = Card & {list: List}