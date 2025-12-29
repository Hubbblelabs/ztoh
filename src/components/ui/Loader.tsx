import React from 'react';
import { GraduationCap } from 'lucide-react';

interface LoaderProps {
    fullScreen?: boolean;
    text?: string;
    className?: string;
}

export default function Loader({ fullScreen = false, text = 'Loading...', className = '' }: LoaderProps) {
    const content = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative flex items-center justify-center">
                {/* Outer spinning ring */}
                <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-sky-500 animate-spin"></div>
                
                {/* Inner icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center animate-pulse">
                        <GraduationCap className="w-5 h-5 text-sky-600" />
                    </div>
                </div>
            </div>
            {text && (
                <p className="text-slate-500 font-medium text-sm tracking-wide animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-all duration-300">
                {content}
            </div>
        );
    }

    return content;
}
