import { currentUser, auth } from "@clerk/nextjs"
import {initEdgeStore} from "@edgestore/server"
import {CreateContextOptions, createEdgeStoreNextHandler} from "@edgestore/server/adapters/next/app"

// type Context = {
//     userId: string
//     userRole: "admin" | "user"
// }

// function createContext({req}: CreateContextOptions): Context {
//  return {
//     userId: "123",
//     userRole: "admin"
//  }
// }

const es = initEdgeStore.create()

const edgeStoreRouter = es.router({
    myPublicImages: es.imageBucket(),
    myProtectedFiles: es.fileBucket()
})

const handler = createEdgeStoreNextHandler({
    router: edgeStoreRouter,
})

export {handler as GET, handler as POST}

export type EdgeStoreRouter = typeof edgeStoreRouter