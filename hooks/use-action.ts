import { useState, useCallback } from "react";

import { ActionState, FieldErrors } from "@/lib/create-safe-action";

type Action<TInput,TOutput> = (data: TInput) => Promise<ActionState<TInput,TOutput>>

interface UseActionOptions<TOutput> {
    onSuccess?: (data: TOutput) => void
    onError?: (error: string) => void
    onComplete?: () => void
}

export const useAction =  <TInput,TOutput> (
    action: Action<TInput,TOutput>,
    options: UseActionOptions<TOutput> = {}
) => {
    const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(
        undefined
    )
    const [error, setError] = useState<string | undefined>(undefined)
    const [data, setData] = useState<TOutput | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    //execute func called inside components - accepts input and sends it to action  to ActionState to validate
    const execute = useCallback(
        async (input: TInput) => {
            setIsLoading(true)

            try {
                const result = await action(input)

                //if no result -  return 
                if (!result) {
                    return
                }

                //something went wrong with validation
                if (result.fieldErrors) {
                    setFieldErrors(result.fieldErrors)
                }

                //if server error set error and callback - internal error, not rendered
                if (result.error) {
                    setError(result.error)
                    options.onError?.(result.error)
                }

                //shoow when validation successed
                if (result.data) {
                    setData(result.data)
                    options.onSuccess?.(result.data)
                }
            } finally {
                setIsLoading(false)
                options.onComplete?.()
            }
            
        },
        [action, options]
    )

    return {
        execute,
        fieldErrors,
        error,
        data,
        isLoading
    }
}