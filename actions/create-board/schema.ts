import {z} from "zod"


// walidacja tytułu
export const CreateBoard = z.object({
    title: z.string({
        required_error: "Title required",
        invalid_type_error: "Title is required"
    }).min(3, {
        message: "Title is too short"
    })
})