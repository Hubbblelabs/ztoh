import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsAppIcon() {
    return (
        <a
            href="https://wa.me/919564321000"
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 left-6 z-50 group flex items-center justify-center"
            aria-label="Chat on WhatsApp"
        >
            <div className="relative flex items-center justify-center">
                {/* Pulse Effect */}
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>

                {/* Main Button */}
                <div className="relative bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center gap-2 overflow-hidden w-16 group-hover:w-48">
                    <FaWhatsapp className="w-8 h-8 flex-shrink-0" />
                    <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-medium">
                        Chat With Us
                    </span>
                </div>
            </div>
        </a>
    );
}
