"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDown } from "lucide-react"
import { type DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface DateRangePickerProps {
    date: DateRange | undefined
    setDate: (date: DateRange | undefined) => void
    align?: "start" | "center" | "end"
    className?: string
}

export function DateRangePicker({
    date,
    setDate,
    align = "start",
    className,
}: DateRangePickerProps) {
    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-full sm:w-[300px] h-9 justify-start text-left font-normal px-3",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <span className="text-xs font-semibold text-muted-foreground uppercase mr-2 text-nowrap">Date Range:</span>
                        <div className="flex-1 truncate">
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Select date</span>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] overflow-hidden p-0 dark:border-zinc-800" align={align}>
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={1}
                        captionLayout="dropdown"
                        className="w-full bg-transparent"
                        classNames={{
                            month: "w-full space-y-4",
                            head_row: "w-full bg-muted/50 mt-2",
                            row: "w-full mt-2",
                            table: "w-full border-collapse space-y-1",
                            head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                            cell: "text-center text-sm p-0 mx-auto relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-9 w-9 p-0 mx-auto font-normal aria-selected:opacity-100"
                        }}
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}
