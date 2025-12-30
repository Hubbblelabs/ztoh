import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollHintProps {
  className?: string;
}

export default function ScrollHint({ className }: ScrollHintProps) {
  return (
    <div className={cn("flex items-center justify-end gap-1 text-slate-400 mt-4 lg:hidden pr-4", className)}>
      <div className="flex animate-pulse">
        <ChevronRight size={20} className="text-slate-300 -mr-3 animate-[ping_1.5s_ease-in-out_infinite]" />
        <ChevronRight size={20} className="text-slate-400 -mr-3" />
        <ChevronRight size={20} className="text-slate-500" />
      </div>
    </div>
  );
}
