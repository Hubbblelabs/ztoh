"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut } from "lucide-react";
import { useSetPageTitle } from '@/hooks/useSetPageTitle';

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
    useSetPageTitle(`Welcome, ${session?.user?.name || 'Student'}`, 'Student Dashboard');
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

    if (loading) {
        return (
            <div className="p-8 max-w-7xl mx-auto">
                {/* Header Skeleton */}
                <div className="flex items-center justify-between mb-8">
                    <div className="space-y-2">
                        <Skeleton className="h-9 w-48" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-10 w-28" />
                </div>

                {/* Stats Skeleton */}
                <div className="bg-muted/50 p-6 rounded-md border border-border mb-8 max-w-sm">
                    <Skeleton className="h-5 w-36 mb-2" />
                    <Skeleton className="h-10 w-24" />
                </div>

                {/* History Skeleton */}
                <div className="bg-card rounded-md shadow-sm border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                        <Skeleton className="h-6 w-36" />
                    </div>
                    <div className="p-6 space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex items-center gap-4">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32 flex-1" />
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-4 w-12" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    if (!data) return <div className="p-8">Failed to load data</div>;

    return (
        <div className="p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
                    <p className="text-muted-foreground">View your learning progress</p>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center gap-2 px-4 py-2 bg-card border border-border text-foreground rounded-md hover:bg-muted transition-colors shadow-sm font-medium"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>

            {/* Stats */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-md border border-blue-100 dark:border-blue-900/30 mb-8 max-w-sm">
                <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">Total Logged Hours</h2>
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">{data.totalHours.toFixed(1)} hrs</div>
            </div>

            {/* History */}
            <div className="bg-card rounded-md shadow-sm border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                    <h2 className="text-xl font-bold text-foreground">Learning History</h2>
                </div>

                {/* Desktop View (Table) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tutor</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Course</th>
                                <th className="px-6 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hours</th>
                            </tr>
                        </thead>
                        <tbody className="bg-card divide-y divide-border">
                            {data.recentLogs.map((log) => (
                                <tr key={log._id} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                                        {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{log.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.staffId?.name || 'Unknown'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">{log.course || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground text-right font-bold">
                                        {log.hours.toFixed(1)}
                                    </td>
                                </tr>
                            ))}
                            {data.recentLogs.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                        No learning hours recorded yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View (Cards) */}
                <div className="md:hidden divide-y divide-border">
                    {data.recentLogs.map((log) => (
                        <div key={log._id} className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-foreground">{log.subject}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(log.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </p>
                                </div>
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 px-3 py-1 rounded-lg text-sm font-bold">
                                    {log.hours.toFixed(1)} hrs
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Tutor</p>
                                    <p className="text-foreground font-medium truncate">{log.staffId?.name || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Course</p>
                                    <p className="text-foreground font-medium truncate">{log.course || '-'}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {data.recentLogs.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground">
                            No learning hours recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
