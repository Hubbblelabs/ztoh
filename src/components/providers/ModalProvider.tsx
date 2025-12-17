"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import JoinUsModal from "@/components/ui/JoinUsModal";

interface ModalContextType {
    openJoinUsModal: () => void;
    closeJoinUsModal: () => void;
    isJoinUsModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isJoinUsModalOpen, setIsJoinUsModalOpen] = useState(false);

    const openJoinUsModal = () => setIsJoinUsModalOpen(true);
    const closeJoinUsModal = () => setIsJoinUsModalOpen(false);

    return (
        <ModalContext.Provider
            value={{ openJoinUsModal, closeJoinUsModal, isJoinUsModalOpen }}
        >
            {children}
            <JoinUsModal isOpen={isJoinUsModalOpen} onClose={closeJoinUsModal} />
        </ModalContext.Provider>
    );
}

export function useJoinUsModal() {
    const context = useContext(ModalContext);
    if (context === undefined) {
        throw new Error("useJoinUsModal must be used within a ModalProvider");
    }
    return context;
}
