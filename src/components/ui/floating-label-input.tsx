"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface FloatingLabelInputProps extends React.ComponentProps<"input"> {
    label: string;
    required?: boolean;
}

// Helper function removed as Flexbox layout handles spacing automatically

const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
    ({ className, type, label, ...props }, ref) => {
        return (
            <div className={cn(
                "group flex h-12 w-full items-center rounded-md border border-zinc-300 dark:border-zinc-700 bg-background px-3 transition-colors focus-within:ring-2 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-500 focus-within:border-zinc-400 dark:focus-within:border-zinc-400",
                className
            )}>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-center mr-1 select-none pointer-events-none">
                    {label}
                    <span className="mx-1">:</span>
                </label>
                <input
                    type={type}
                    className="flex-1 bg-transparent py-2 text-base text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
FloatingLabelInput.displayName = "FloatingLabelInput";

interface FloatingLabelTextareaProps extends React.ComponentProps<"textarea"> {
    label: string;
    required?: boolean;
}

const FloatingLabelTextarea = React.forwardRef<HTMLTextAreaElement, FloatingLabelTextareaProps>(
    ({ className, label, ...props }, ref) => {
        return (
            <div className={cn(
                "flex w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-background px-3 py-3 transition-colors focus-within:ring-2 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-500 focus-within:border-zinc-400 dark:focus-within:border-zinc-400",
                className
            )}>
                <label
                    className="text-xs font-medium text-slate-500 uppercase tracking-wide whitespace-nowrap flex items-start mt-0.5 mr-1 select-none pointer-events-none"
                    style={{ paddingTop: '2px' }} // Fine-tune alignment with first line of text
                >
                    {label}
                    <span className="mx-1">:</span>
                </label>
                <textarea
                    className="flex-1 min-h-[80px] bg-transparent p-0 text-base text-foreground placeholder:text-muted-foreground outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none leading-normal"
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
FloatingLabelTextarea.displayName = "FloatingLabelTextarea";

export { FloatingLabelInput, FloatingLabelTextarea };
