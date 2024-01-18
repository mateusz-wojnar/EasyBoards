import {z} from "zod"


// validation - zod
export const CreateBoard = z.object({
    title: z.string({
        required_error: "Title required.",
        invalid_type_error: "Title required."
    }).min(3, {
        message: "Title too short."
    }),
    image: z.string({
        required_error: "Image required",
        invalid_type_error: "Image required"
    })
})