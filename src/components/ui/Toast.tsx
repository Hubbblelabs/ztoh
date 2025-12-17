"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
    id: string;
    message: string;
    type: ToastType;
    onClose: (id: string) => void;
    duration?: number;
}

const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
};

const styles = {
    success: "bg-white border-green-100 text-slate-800",
    error: "bg-white border-red-100 text-slate-800",
    info: "bg-white border-blue-100 text-slate-800",
    warning: "bg-white border-yellow-100 text-slate-800",
};

const iconStyles = {
    success: "text-green-500",
    error: "text-red-500",
    info: "text-blue-500",
    warning: "text-yellow-500",
};

export default function Toast({ id, message, type, onClose, duration = 5000 }: ToastProps) {
    const Icon = icons[type];

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={cn(
                "flex items-center gap-4 p-4 rounded-2xl shadow-lg border backdrop-blur-sm min-w-[300px] max-w-md pointer-events-auto",
                styles[type]
            )}
        >
            <div className={cn("p-2 rounded-full bg-opacity-10", iconStyles[type].replace("text-", "bg-"))}>
                <Icon size={20} className={iconStyles[type]} />
            </div>
            <p className="flex-1 text-sm font-medium">{message}</p>
            <button
                onClick={() => onClose(id)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
