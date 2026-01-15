"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    Check,
    X,
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

interface Student {
    _id: string;
    name: string;
    email: string;
}

interface Group {
    _id: string;
    name: string;
    studentIds: Student[];
    staffIds: string[]; // Updated type definition
    description?: string;
    createdAt?: string;
}

export default function StaffGroupsPage() {
    useSetPageTitle('My Groups', 'View your assigned student groups');

    const { data: session } = useSession();
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch("/api/staff/groups");

            if (res.ok) {
                const groupsData = await res.json();
                setGroups(groupsData.groups);
            }
        } catch (error) {
            console.error("Failed to fetch data");
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-card rounded-lg p-6 shadow-sm border border-border">
                            <div className="flex justify-between items-start mb-4">
                                <Skeleton className="h-12 w-12 rounded-md" />
                            </div>
                            <div className="space-y-2 mb-4">
                                <Skeleton className="h-6 w-2/3" />
                                <Skeleton className="h-4 w-full" />
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center justify-between mb-3">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-6 w-8" />
                                </div>
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((j) => (
                                        <Skeleton key={j} className="h-8 w-8 rounded-full" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-md shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'} transition-all duration-300`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-card rounded-lg border border-dashed border-border text-muted-foreground">
                        <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-foreground">No Groups Assigned</h3>
                        <p className="text-muted-foreground mb-6 max-w-sm mx-auto">You haven&apos;t been assigned any student groups yet.</p>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group._id} className="bg-card rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-md">
                                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-foreground mb-1">{group.name}</h3>
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[2.5em]">
                                {group.description || "No description provided"}
                            </p>

                            <div className="pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Members</span>
                                    <span className="px-2 py-1 bg-muted text-foreground font-semibold rounded-md">
                                        {group.studentIds.length}
                                    </span>
                                </div>
                                <div className="mt-3 flex -space-x-2 px-2 py-1">
                                    {group.studentIds.slice(0, 5).map((student, i) => (
                                        <div key={i} className="shrink-0 h-8 w-8 rounded-full ring-2 ring-background bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400" title={student.name}>
                                            {student.name.charAt(0)}
                                        </div>
                                    ))}
                                    {group.studentIds.length > 5 && (
                                        <div className="shrink-0 h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                                            +{group.studentIds.length - 5}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
