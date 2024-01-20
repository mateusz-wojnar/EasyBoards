import {z} from "zod"

export const UpdateCard = z.object({
    boardId: z.string(),
    description: z.optional(
        z.string({
            required_error: "Description required",
            invalid_type_error: "Description required"
        }).min(5, {
            message: "Description too short.",
        }).max(100,{
            message: "Description has maximum oh 60 characters.",
        }),
    ),
    title: z.optional(
        z.string({
            required_error: "Title required",
            invalid_type_error: "Title required"   
        }).min(3,{
        message: "Title too short"
        }),
    ),
    id: z.string()
})