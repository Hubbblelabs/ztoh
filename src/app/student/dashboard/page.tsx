"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Loader from "@/components/ui/Loader";
import { LogOut } from "lucide-react";

interface TeachingHours {
    _id: string;
    staffId: { name: string };
    date: string;
    hours: number;
    subject: string;
    course?: string;
    description?: string;
}

interface DashboardData {
    totalHours: number;
    recentLogs: TeachingHours[];
}

export default function StudentDashboardPage() {
    const { data: session } = useSession();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/student/dashboard");
                if (res.ok) {
                    const dashboardData = await res.json();
                    setData(dashboardData);
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader /></div>;
    if (!data) return <div className="p-8">Failed to load data</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Welcome, {session?.user?.name}</h1>
                    <p className="text-slate-500">Student Dashboard</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors shadow-sm font-medium"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>

            {/* Stats */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-8 max-w-sm">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Total Logged Hours</h2>
                <div className="text-4xl font-bold text-blue-600">{data.totalHours.toFixed(1)} hrs</div>
            </div>

            {/* History */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Learning History</h2>
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Tutor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                            {data.recentLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 font-medium">
                                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{log.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{log.staffId?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{log.course || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-bold">
                                        {log.hours.toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                            {data.recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No learning hours recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-slate-100">
                    {data.recentLogs.map((log) => (
                        <div key={log._id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-900">{log.subject}</p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm font-bold">
                                    {log.hours.toFixed(1)} hrs
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Tutor</p>
                                    <p className="text-slate-700 font-medium truncate">{log.staffId?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400 uppercase">Course</p>
                                    <p className="text-slate-700 font-medium truncate">{log.course || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.recentLogs.length === 0 && (
                        <div className="p-8 text-center text-slate-500">
                            No learning hours recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
