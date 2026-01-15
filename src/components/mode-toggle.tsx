"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
    const { setTheme, resolvedTheme } = useTheme()

    const toggleTheme = () => {
        // Toggle between light and dark based on the resolved theme
        // resolvedTheme gives us the actual theme being used (even when set to "system")
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    )
}
