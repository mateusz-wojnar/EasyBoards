import { ActionResult } from "next/dist/server/app-render/types"
import {z} from "zod"

//wrapper to combine server action for validation and crud operations

export type FieldErrors<T> = {
    [K in keyof T]?: string[]
}

export type ActionState<TInput, TOutput> = {
    fieldErrors?: FieldErrors<TInput>
    error?: string | null
    data?: TOutput
}

export const createSafeAction = <TInput, TOutput>(
    schema: z.Schema<TInput>,
    handler: (validatedData: TInput) => Promise<ActionState<TInput, TOutput>>
) => {
    return async (data: TInput): Promise<ActionState<TInput, TOutput>> => {
        const validationResult = schema.safeParse(data)
        if (!validationResult.success) {
            return {
                fieldErrors: validationResult.error.flatten().fieldErrors as FieldErrors<TInput>
            }
        }

        return handler(validationResult.data)
    }
}