import { XCircleIcon } from "lucide-react";

// reusable form error component

interface FormErrorsProps {
    id: string
    errors?: Record<string, string[] | undefined>
}

export const FormErrors = ({
    id,
    errors
}: FormErrorsProps) => {
    // if form has no errors do not render component
    if (!errors) {
        return null
    }

    return (
        <div
            id={`${id}-error`}
            aria-live="polite"
            className="mt-2 text-xs text-rose-400"
        >
            {errors?.[id]?.map((error: string) => (
                <div
                    key={error}
                    className="flex items-center font-medium p-2 border border-rose-400 bg-rose-400/10 rounded-sm"
                >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    {error}
                </div>
            ))}
        </div>
    )
}