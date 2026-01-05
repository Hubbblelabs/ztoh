"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    Users,
    Check,
    X,
} from "lucide-react";
import Loader from "@/components/ui/Loader";

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

    if (loading) return <Loader fullScreen />;

    return (
        <div className="space-y-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'} transition-all duration-300`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Groups</h1>
                    <p className="text-slate-500">View your assigned student groups</p>
                </div>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No Groups Assigned</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">You haven't been assigned any student groups yet.</p>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-blue-50 rounded-xl">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">{group.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">
                                {group.description || "No description provided"}
                            </p>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Members</span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
                                        {group.studentIds.length}
                                    </span>
                                </div>
                                <div className="mt-3 flex -space-x-2 px-2 py-1">
                                    {group.studentIds.slice(0, 5).map((student, i) => (
                                        <div key={i} className="shrink-0 h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600" title={student.name}>
                                            {student.name.charAt(0)}
                                        </div>
                                    ))}
                                    {group.studentIds.length > 5 && (
                                        <div className="shrink-0 h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-600">
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
