'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    Check,
    Clock,
    Eye,
    Heart,
    Inbox,
    Lightbulb,
    Loader2,
    MessageSquare,
    MessageSquareWarning,
    Search,
    Sparkles,
    Star,
    Trash2,
    X,
    type LucideIcon,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import { cn } from '@/lib/utils';
import {
    FEEDBACK_STATUSES,
    FEEDBACK_STATUS_LABELS,
    FEEDBACK_TOPICS,
    FEEDBACK_TOPIC_LABELS,
    FEEDBACK_TYPES,
    FEEDBACK_TYPE_LABELS,
    RATING_LABELS,
    type FeedbackStatus,
    type FeedbackTopic,
    type FeedbackType,
} from '@/lib/feedback';
import { FeedbackEntry } from '../components/types';
import { useFeedbackCount } from '../feedback-count-context';

type SortOrder = 'newest' | 'oldest' | 'rating_high' | 'rating_low';

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    new: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    in_review: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    planned: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    dismissed: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const TYPE_ICONS: Record<FeedbackType, { icon: LucideIcon; className: string }> = {
    general: { icon: MessageSquare, className: 'text-sky-500' },
    suggestion: { icon: Lightbulb, className: 'text-amber-500' },
    complaint: { icon: MessageSquareWarning, className: 'text-rose-500' },
    praise: { icon: Heart, className: 'text-emerald-500' },
};

const SORT_LABELS: Record<SortOrder, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
    rating_high: 'Highest rated',
    rating_low: 'Lowest rated',
};

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

function StatusBadge({ status }: { status: FeedbackStatus }) {
    return (
        <span
            className={cn(
                'inline-flex whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide',
                STATUS_STYLES[status],
            )}
        >
            {FEEDBACK_STATUS_LABELS[status]}
        </span>
    );
}

function TypeChip({ type }: { type: FeedbackType }) {
    const { icon: Icon, className } = TYPE_ICONS[type];
    return (
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
            <Icon size={12} className={className} />
            {FEEDBACK_TYPE_LABELS[type]}
        </span>
    );
}

function RatingStars({ rating, size = 14 }: { rating?: number; size?: number }) {
    if (!rating) return <span className="text-xs text-muted-foreground">Not rated</span>;
    return (
        <span
            className="inline-flex items-center gap-0.5"
            title={`${rating}/5 · ${RATING_LABELS[rating - 1]}`}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    size={size}
                    aria-hidden="true"
                    className={
                        value <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-muted-foreground/30'
                    }
                />
            ))}
            <span className="sr-only">{rating} out of 5</span>
        </span>
    );
}

export default function FeedbackPage() {
    useSetPageTitle('Feedback', 'Review feedback and suggestions from the website');
    const { setNewCount } = useFeedbackCount();

    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Search, Sort, Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<FeedbackType | 'all'>('all');
    const [topicFilter, setTopicFilter] = useState<FeedbackTopic | 'all'>('all');
    const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

    // Dialogs
    const [selected, setSelected] = useState<FeedbackEntry | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<FeedbackEntry | null>(null);
    const [deleting, setDeleting] = useState(false);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await fetch('/api/admin/feedback');
                if (response.ok) {
                    setFeedback(await response.json());
                } else if (response.status === 401) {
                    window.location.href = '/login';
                } else {
                    showToast('Failed to fetch feedback', 'error');
                }
            } catch (error) {
                console.error('Failed to fetch feedback:', error);
                showToast('Failed to fetch feedback', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchFeedback();
    }, [showToast]);

    // Keep the sidebar badge in step with changes made on this page
    useEffect(() => {
        if (!loading) setNewCount(feedback.filter((item) => item.status === 'new').length);
    }, [feedback, loading, setNewCount]);

    const stats = useMemo(() => {
        const ratings = feedback.flatMap((item) => (item.rating ? [item.rating] : []));
        return {
            total: feedback.length,
            new: feedback.filter((item) => item.status === 'new').length,
            inProgress: feedback.filter(
                (item) => item.status === 'in_review' || item.status === 'planned',
            ).length,
            averageRating: ratings.length
                ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
                : null,
            ratingCount: ratings.length,
        };
    }, [feedback]);

    const displayedFeedback = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return feedback
            .filter(
                (item) =>
                    (statusFilter === 'all' || item.status === statusFilter) &&
                    (typeFilter === 'all' || item.type === typeFilter) &&
                    (topicFilter === 'all' || item.topic === topicFilter) &&
                    (!term ||
                        [item.name, item.email, item.subject, item.message, item.trackingId].some(
                            (value) => value.toLowerCase().includes(term),
                        )),
            )
            .sort((a, b) => {
                if (sortOrder === 'rating_high' || sortOrder === 'rating_low') {
                    const ratingA = a.rating ?? 0;
                    const ratingB = b.rating ?? 0;
                    if (ratingA !== ratingB) {
                        // Unrated feedback always goes last
                        if (!ratingA) return 1;
                        if (!ratingB) return -1;
                        return sortOrder === 'rating_high' ? ratingB - ratingA : ratingA - ratingB;
                    }
                }
                const newestFirst =
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                return sortOrder === 'oldest' ? -newestFirst : newestFirst;
            });
    }, [feedback, searchTerm, statusFilter, typeFilter, topicFilter, sortOrder]);

    const hasActiveFilters =
        searchTerm !== '' ||
        statusFilter !== 'all' ||
        typeFilter !== 'all' ||
        topicFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setTopicFilter('all');
    };

    const handleStatusChange = async (status: FeedbackStatus) => {
        if (!selected || status === selected.status) return;
        setUpdatingStatus(true);

        try {
            const response = await fetch(`/api/admin/feedback/${selected._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                const updated: FeedbackEntry = await response.json();
                setFeedback((prev) =>
                    prev.map((item) => (item._id === updated._id ? updated : item)),
                );
                // Don't reopen the dialog if it was closed while the request was in flight
                setSelected((current) => (current?._id === updated._id ? updated : current));
                showToast(`Marked as ${FEEDBACK_STATUS_LABELS[status]}`, 'success');
            } else {
                showToast('Failed to update status', 'error');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            showToast('Failed to update status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setDeleting(true);

        try {
            const response = await fetch(`/api/admin/feedback/${deleteTarget._id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setFeedback((prev) => prev.filter((item) => item._id !== deleteTarget._id));
                setDeleteTarget(null);
                showToast('Feedback deleted', 'success');
            } else {
                showToast('Failed to delete feedback', 'error');
            }
        } catch (error) {
            console.error('Failed to delete feedback:', error);
            showToast('Failed to delete feedback', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const statCards = [
        {
            title: 'Total Feedback',
            value: stats.total,
            icon: Inbox,
            bgColor: 'bg-slate-100 dark:bg-slate-800',
            textColor: 'text-slate-700 dark:text-slate-300',
        },
        {
            title: 'New',
            value: stats.new,
            icon: Sparkles,
            bgColor: 'bg-sky-100 dark:bg-sky-900/20',
            textColor: 'text-sky-600 dark:text-sky-400',
        },
        {
            title: 'In Review / Planned',
            value: stats.inProgress,
            icon: Clock,
            bgColor: 'bg-violet-100 dark:bg-violet-900/20',
            textColor: 'text-violet-600 dark:text-violet-400',
        },
        {
            title:
                stats.ratingCount > 0 ? `Avg. Rating (${stats.ratingCount} rated)` : 'Avg. Rating',
            value: stats.averageRating === null ? '—' : stats.averageRating.toFixed(1),
            icon: Star,
            bgColor: 'bg-amber-100 dark:bg-amber-900/20',
            textColor: 'text-amber-600 dark:text-amber-400',
        },
    ];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-card rounded-md p-5 shadow-sm border border-border"
                        >
                            <Skeleton className="h-10 w-10 rounded-md mb-4" />
                            <Skeleton className="h-8 w-14 mb-2" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    ))}
                </div>
                <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
                    <div className="flex flex-wrap gap-3">
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-40" />
                        <Skeleton className="h-9 w-40" />
                    </div>
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 border-b border-border"
                            >
                                <div className="flex-1 space-y-2">
                                    <Skeleton className="h-5 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 w-28" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed bottom-4 right-4 z-[60] px-6 py-3 rounded-md shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'}`}
                >
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-card rounded-md p-5 shadow-sm border border-border"
                    >
                        <div className={cn('w-fit p-2.5 rounded-md mb-4', card.bgColor)}>
                            <card.icon className={cn('w-5 h-5', card.textColor)} />
                        </div>
                        <p className="text-3xl font-bold text-foreground">{card.value}</p>
                        <p className="text-sm text-muted-foreground mt-1">{card.title}</p>
                    </div>
                ))}
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border p-6 space-y-6">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full sm:w-64">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            size={18}
                        />
                        <input
                            type="text"
                            placeholder="Search feedback..."
                            aria-label="Search feedback"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-500 focus:border-zinc-400 w-full"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value as FeedbackStatus | 'all')}
                    >
                        <SelectTrigger className="w-[180px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Status:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {FEEDBACK_STATUSES.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {FEEDBACK_STATUS_LABELS[status]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={typeFilter}
                        onValueChange={(value) => setTypeFilter(value as FeedbackType | 'all')}
                    >
                        <SelectTrigger className="w-[170px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Type:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {FEEDBACK_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {FEEDBACK_TYPE_LABELS[type]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={topicFilter}
                        onValueChange={(value) => setTopicFilter(value as FeedbackTopic | 'all')}
                    >
                        <SelectTrigger className="w-[220px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Topic:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {FEEDBACK_TOPICS.map((topic) => (
                                <SelectItem key={topic} value={topic}>
                                    {FEEDBACK_TOPIC_LABELS[topic]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value as SortOrder)}
                    >
                        <SelectTrigger className="w-[190px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Sort:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {(Object.keys(SORT_LABELS) as SortOrder[]).map((order) => (
                                <SelectItem key={order} value={order}>
                                    {SORT_LABELS[order]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* List */}
                {feedback.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-16">
                        <div className="p-4 rounded-full bg-muted mb-4">
                            <Inbox className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h3 className="font-semibold text-foreground">No feedback yet</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            Submissions from the public{' '}
                            <Link
                                href="/feedback"
                                target="_blank"
                                className="text-primary hover:underline"
                            >
                                Feedback &amp; Suggestions
                            </Link>{' '}
                            page will appear here.
                        </p>
                    </div>
                ) : displayedFeedback.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No feedback matches your filters.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-3 text-sm font-medium text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop View: fixed layout so long subjects truncate instead of
                            widening the page */}
                        <div className="hidden xl:block rounded-md border border-border overflow-hidden">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <th className="px-4 py-4">Feedback</th>
                                        <th className="px-4 py-4 w-28">Rating</th>
                                        <th className="px-4 py-4 w-32">Status</th>
                                        <th className="px-4 py-4 w-36">Submitted</th>
                                        <th className="px-4 py-4 w-28 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {displayedFeedback.map((item) => (
                                        <tr
                                            key={item._id}
                                            onClick={() => setSelected(item)}
                                            className="hover:bg-muted/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    {item.status === 'new' && (
                                                        <span
                                                            className="h-2 w-2 shrink-0 rounded-full bg-sky-500"
                                                            title="New"
                                                        />
                                                    )}
                                                    <span className="font-semibold text-foreground truncate">
                                                        {item.subject}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                                    <TypeChip type={item.type} />
                                                    <span className="truncate">
                                                        {FEEDBACK_TOPIC_LABELS[item.topic]} ·{' '}
                                                        {item.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <RatingStars rating={item.rating} />
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={item.status} />
                                            </td>
                                            <td className="px-4 py-4 text-sm text-muted-foreground">
                                                {formatDate(item.createdAt)}
                                            </td>
                                            <td className="px-4 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelected(item);
                                                        }}
                                                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                                        title="View Details"
                                                        aria-label={`View feedback: ${item.subject}`}
                                                    >
                                                        <Eye size={18} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteTarget(item);
                                                        }}
                                                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                        title="Delete"
                                                        aria-label={`Delete feedback: ${item.subject}`}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile / Tablet View */}
                        <div className="xl:hidden grid gap-4 lg:grid-cols-2">
                            {displayedFeedback.map((item) => (
                                <div
                                    key={item._id}
                                    className="min-w-0 bg-card p-4 rounded-md border border-border shadow-sm space-y-3"
                                >
                                    <div className="flex justify-between items-start gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1.5">
                                                <TypeChip type={item.type} />
                                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    {item.trackingId}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-foreground break-words">
                                                {item.subject}
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {item.name} · {item.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => setSelected(item)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                                aria-label={`View feedback: ${item.subject}`}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                aria-label={`Delete feedback: ${item.subject}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 items-center text-xs">
                                        <StatusBadge status={item.status} />
                                        <RatingStars rating={item.rating} size={12} />
                                        <span className="text-muted-foreground ml-auto">
                                            {formatDate(item.createdAt)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Details Dialog */}
            <Dialog
                open={!!selected}
                onOpenChange={(open) => {
                    if (!open) setSelected(null);
                }}
            >
                <DialogContent className="admin-theme sm:max-w-2xl max-h-[90vh] overflow-y-auto gap-6">
                    {selected && (
                        <>
                            <DialogHeader className="pr-8 space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <TypeChip type={selected.type} />
                                    <span className="text-xs text-muted-foreground">
                                        {FEEDBACK_TOPIC_LABELS[selected.topic]}
                                    </span>
                                </div>
                                <DialogTitle className="text-xl leading-snug break-words">
                                    {selected.subject}
                                </DialogTitle>
                                <DialogDescription>
                                    Ref. <span className="font-mono">{selected.trackingId}</span> ·
                                    Submitted {formatDate(selected.createdAt)}
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid gap-4 sm:grid-cols-2 p-4 bg-muted rounded-md border border-border">
                                <div>
                                    <label
                                        htmlFor="feedback-status"
                                        className="block text-xs font-semibold text-muted-foreground uppercase mb-1"
                                    >
                                        Status
                                    </label>
                                    <Select
                                        value={selected.status}
                                        onValueChange={(value) =>
                                            handleStatusChange(value as FeedbackStatus)
                                        }
                                        disabled={updatingStatus}
                                    >
                                        <SelectTrigger
                                            id="feedback-status"
                                            className="w-full h-10 rounded-md bg-card"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {FEEDBACK_STATUSES.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {FEEDBACK_STATUS_LABELS[status]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        Rating
                                    </p>
                                    <div className="flex h-10 items-center gap-2">
                                        <RatingStars rating={selected.rating} size={18} />
                                        {selected.rating && (
                                            <span className="text-sm text-muted-foreground">
                                                {RATING_LABELS[selected.rating - 1]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                                    Message
                                </h4>
                                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
                                    {selected.message}
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t border-border text-sm">
                                <div className="min-w-0">
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        From
                                    </h4>
                                    <p className="font-medium text-foreground">{selected.name}</p>
                                    <a
                                        href={`mailto:${selected.email}`}
                                        className="text-primary hover:underline break-all"
                                    >
                                        {selected.email}
                                    </a>
                                </div>
                                <div>
                                    <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                                        Last Updated
                                    </h4>
                                    <p className="text-foreground">
                                        {formatDate(selected.updatedAt)}
                                    </p>
                                </div>
                            </div>

                            <DialogFooter className="gap-2">
                                <button
                                    onClick={() => {
                                        setDeleteTarget(selected);
                                        setSelected(null);
                                    }}
                                    className="px-4 py-2 bg-card border border-border text-red-600 rounded-md text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                                <button
                                    onClick={() => setSelected(null)}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors"
                                >
                                    Close
                                </button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open && !deleting) setDeleteTarget(null);
                }}
            >
                <DialogContent className="admin-theme sm:max-w-md">
                    {deleteTarget && (
                        <>
                            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                <Trash2 size={32} />
                            </div>
                            <DialogHeader className="sm:text-center">
                                <DialogTitle className="text-xl">Delete Feedback?</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete &ldquo;{deleteTarget.subject}
                                    &rdquo; from{' '}
                                    <span className="font-semibold text-foreground">
                                        {deleteTarget.name}
                                    </span>
                                    ? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:justify-center">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    disabled={deleting}
                                    className="px-6 py-2 bg-card border border-border text-foreground rounded-md text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="px-6 py-2 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {deleting && <Loader2 className="animate-spin" size={16} />}
                                    Delete
                                </button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
