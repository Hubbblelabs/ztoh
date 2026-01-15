import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
    HTMLTextAreaElement,
    React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground outline-none focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 dark:focus:border-zinc-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Textarea.displayName = "Textarea"

export { Textarea }
