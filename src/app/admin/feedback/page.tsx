'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Building2,
    Check,
    CircleCheck,
    Eye,
    GraduationCap,
    Inbox,
    Loader2,
    PhoneCall,
    Search,
    Sparkles,
    Trash2,
    Users,
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
import { cn, toWhatsAppUrl } from '@/lib/utils';
import {
    ACADEMIC_SUPPORT_LABELS,
    CURRICULUM_LABELS,
    EXAM_LABELS,
    FEEDBACK_FIELD_LABELS,
    FEEDBACK_NEEDS,
    FEEDBACK_STATUSES,
    FEEDBACK_STATUS_LABELS,
    JOB_TYPE_LABELS,
    NEED_LABELS,
    REGISTRATION_TYPES,
    REGISTRATION_TYPE_LABELS,
    type FeedbackNeed,
    type FeedbackStatus,
    type RegistrationType,
} from '@/lib/feedback';
import { FeedbackEntry } from '../components/types';
import { useFeedbackCount } from '../feedback-count-context';

type SortOrder = 'newest' | 'oldest';

const STATUS_STYLES: Record<FeedbackStatus, string> = {
    new: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    contacted: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    no_answer: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    follow_up: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    converted: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    not_interested: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

const REGISTRATION_TYPE_ICONS: Record<RegistrationType, { icon: LucideIcon; className: string }> = {
    student: { icon: GraduationCap, className: 'text-sky-500' },
    parent: { icon: Users, className: 'text-violet-500' },
    teacher: { icon: BookOpen, className: 'text-emerald-500' },
    institution: { icon: Building2, className: 'text-amber-500' },
};

const SORT_LABELS: Record<SortOrder, string> = {
    newest: 'Newest',
    oldest: 'Oldest',
};

const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

// Numbers are stored as typed; a tel: link only needs the digits and a leading +
const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, '')}`;

const yesNo = (value?: boolean) => (value === undefined ? 'Not answered' : value ? 'Yes' : 'No');

// Contact details, the reference number and the names of the options picked (e.g. "IGCSE"),
// with digits-only copies of the phone numbers so "9876543210" finds "98765 43210"
function searchText(item: FeedbackEntry) {
    const phones = [item.phone, item.alternativePhone, item.whatsapp];
    return [
        item.name,
        item.email,
        item.address,
        item.trackingId,
        ...phones,
        ...phones.map((phone) => phone?.replace(/\D/g, '')),
        ...item.needs.map((need) => NEED_LABELS[need]),
        ...item.curriculums.map((curriculum) => CURRICULUM_LABELS[curriculum]),
        ...item.exams.map((exam) => EXAM_LABELS[exam]),
        ...item.academicSupport.map((support) => ACADEMIC_SUPPORT_LABELS[support]),
    ]
        .join(' ')
        .toLowerCase();
}

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

function RegistrationTypeChip({ type }: { type: RegistrationType }) {
    const { icon: Icon, className } = REGISTRATION_TYPE_ICONS[type];
    return (
        <span className="inline-flex items-center gap-1 whitespace-nowrap rounded-md border border-border px-2 py-0.5 text-xs font-medium text-foreground">
            <Icon size={12} className={className} />
            {REGISTRATION_TYPE_LABELS[type]}
        </span>
    );
}

// The options someone ticked in one section of the form, e.g. their needs or boards
function OptionChips<T extends string>({
    values,
    labels,
}: {
    values: readonly T[];
    labels: Record<T, string>;
}) {
    if (values.length === 0) return <span className="text-sm text-muted-foreground">None</span>;
    return (
        <div className="flex flex-wrap gap-1.5">
            {values.map((value) => (
                <span
                    key={value}
                    className="whitespace-nowrap rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground"
                >
                    {labels[value]}
                </span>
            ))}
        </div>
    );
}

function DetailItem({
    label,
    className,
    children,
}: {
    label: string;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <div className={cn('min-w-0', className)}>
            <dt className="text-xs font-semibold text-muted-foreground uppercase mb-1">{label}</dt>
            <dd className="text-sm text-foreground break-words">{children}</dd>
        </div>
    );
}

export default function FeedbackPage() {
    useSetPageTitle('Feedback', 'Review submissions from the website feedback form');
    const { setNewCount } = useFeedbackCount();

    const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Search, Sort, Filter
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<FeedbackStatus | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<RegistrationType | 'all'>('all');
    const [needFilter, setNeedFilter] = useState<FeedbackNeed | 'all'>('all');
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
        const countWith = (...statuses: FeedbackStatus[]) =>
            feedback.filter((item) => statuses.includes(item.status)).length;
        return {
            total: feedback.length,
            new: countWith('new'),
            followUp: countWith('follow_up', 'no_answer'),
            converted: countWith('converted'),
        };
    }, [feedback]);

    const displayedFeedback = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();

        return feedback
            .filter(
                (item) =>
                    (statusFilter === 'all' || item.status === statusFilter) &&
                    (typeFilter === 'all' || item.registrationType === typeFilter) &&
                    (needFilter === 'all' || item.needs.includes(needFilter)) &&
                    (!term || searchText(item).includes(term)),
            )
            .sort((a, b) => {
                const newestFirst =
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                return sortOrder === 'oldest' ? -newestFirst : newestFirst;
            });
    }, [feedback, searchTerm, statusFilter, typeFilter, needFilter, sortOrder]);

    const hasActiveFilters =
        searchTerm !== '' || statusFilter !== 'all' || typeFilter !== 'all' || needFilter !== 'all';

    const clearFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setTypeFilter('all');
        setNeedFilter('all');
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
                showToast('Submission deleted', 'success');
            } else {
                showToast('Failed to delete submission', 'error');
            }
        } catch (error) {
            console.error('Failed to delete submission:', error);
            showToast('Failed to delete submission', 'error');
        } finally {
            setDeleting(false);
        }
    };

    const statCards = [
        {
            title: 'Total Submissions',
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
            title: 'Follow-up / No Answer',
            value: stats.followUp,
            icon: PhoneCall,
            bgColor: 'bg-amber-100 dark:bg-amber-900/20',
            textColor: 'text-amber-600 dark:text-amber-400',
        },
        {
            title: 'Converted',
            value: stats.converted,
            icon: CircleCheck,
            bgColor: 'bg-emerald-100 dark:bg-emerald-900/20',
            textColor: 'text-emerald-600 dark:text-emerald-400',
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
                                <Skeleton className="h-4 w-32" />
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
                            placeholder="Search name, phone, board..."
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
                        <SelectTrigger className="w-[200px] h-9 rounded-md bg-card">
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
                        onValueChange={(value) => setTypeFilter(value as RegistrationType | 'all')}
                    >
                        <SelectTrigger className="w-[240px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Type:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {REGISTRATION_TYPES.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {REGISTRATION_TYPE_LABELS[type]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={needFilter}
                        onValueChange={(value) => setNeedFilter(value as FeedbackNeed | 'all')}
                    >
                        <SelectTrigger className="w-[220px] h-9 rounded-md bg-card">
                            <span className="text-xs font-semibold text-muted-foreground uppercase mr-2">
                                Need:
                            </span>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {FEEDBACK_NEEDS.map((need) => (
                                <SelectItem key={need} value={need}>
                                    {NEED_LABELS[need]}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={sortOrder}
                        onValueChange={(value) => setSortOrder(value as SortOrder)}
                    >
                        <SelectTrigger className="w-[160px] h-9 rounded-md bg-card">
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
                        <h3 className="font-semibold text-foreground">No submissions yet</h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            Submissions from the public{' '}
                            <Link
                                href="/feedback"
                                target="_blank"
                                className="text-primary hover:underline"
                            >
                                Feedback Form
                            </Link>{' '}
                            page will appear here.
                        </p>
                    </div>
                ) : displayedFeedback.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                        <p>No submissions match your filters.</p>
                        <button
                            onClick={clearFilters}
                            className="mt-3 text-sm font-medium text-primary hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Desktop View: fixed layout so long names truncate instead of
                            widening the page */}
                        <div className="hidden xl:block rounded-md border border-border overflow-hidden">
                            <table className="w-full table-fixed text-left border-collapse">
                                <thead>
                                    <tr className="bg-muted border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                                        <th className="px-4 py-4">Submission</th>
                                        <th className="px-4 py-4 w-56">Need</th>
                                        <th className="px-4 py-4 w-40">Status</th>
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
                                                        {item.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
                                                    <RegistrationTypeChip
                                                        type={item.registrationType}
                                                    />
                                                    <span className="truncate">
                                                        {item.phone} · {item.email}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <OptionChips
                                                    values={item.needs}
                                                    labels={NEED_LABELS}
                                                />
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
                                                        aria-label={`View submission from ${item.name}`}
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
                                                        aria-label={`Delete submission from ${item.name}`}
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
                                                <RegistrationTypeChip
                                                    type={item.registrationType}
                                                />
                                                <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                    {item.trackingId}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-foreground break-words">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground truncate">
                                                {item.phone} · {item.email}
                                            </p>
                                        </div>
                                        <div className="flex gap-1 shrink-0">
                                            <button
                                                onClick={() => setSelected(item)}
                                                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                                                aria-label={`View submission from ${item.name}`}
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(item)}
                                                className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                                aria-label={`Delete submission from ${item.name}`}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <OptionChips values={item.needs} labels={NEED_LABELS} />

                                    <div className="flex flex-wrap gap-2 items-center text-xs">
                                        <StatusBadge status={item.status} />
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
                                <div>
                                    <RegistrationTypeChip type={selected.registrationType} />
                                </div>
                                <DialogTitle className="text-xl leading-snug break-words">
                                    {selected.name}
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
                                        {FEEDBACK_FIELD_LABELS.needs}
                                    </p>
                                    <div className="flex min-h-10 items-center">
                                        <OptionChips values={selected.needs} labels={NEED_LABELS} />
                                    </div>
                                </div>
                            </div>

                            <section>
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Contact Details
                                </h4>
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.phone}>
                                        <a
                                            href={telHref(selected.phone)}
                                            className="text-primary hover:underline"
                                        >
                                            {selected.phone}
                                        </a>
                                    </DetailItem>
                                    {selected.alternativePhone && (
                                        <DetailItem label={FEEDBACK_FIELD_LABELS.alternativePhone}>
                                            <a
                                                href={telHref(selected.alternativePhone)}
                                                className="text-primary hover:underline"
                                            >
                                                {selected.alternativePhone}
                                            </a>
                                        </DetailItem>
                                    )}
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.whatsapp}>
                                        <a
                                            href={toWhatsAppUrl(selected.whatsapp)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary hover:underline"
                                        >
                                            {selected.whatsapp}
                                        </a>
                                        {selected.whatsapp === selected.phone && (
                                            <span className="text-muted-foreground">
                                                {' '}
                                                (same as phone)
                                            </span>
                                        )}
                                    </DetailItem>
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.email}>
                                        <a
                                            href={`mailto:${selected.email}`}
                                            className="text-primary hover:underline break-all"
                                        >
                                            {selected.email}
                                        </a>
                                    </DetailItem>
                                    {selected.address && (
                                        <DetailItem
                                            label={FEEDBACK_FIELD_LABELS.address}
                                            className="sm:col-span-2"
                                        >
                                            <span className="whitespace-pre-wrap">
                                                {selected.address}
                                            </span>
                                        </DetailItem>
                                    )}
                                </dl>
                            </section>

                            <section className="pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Support Requested
                                </h4>
                                <dl className="space-y-4">
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.curriculums}>
                                        <OptionChips
                                            values={selected.curriculums}
                                            labels={CURRICULUM_LABELS}
                                        />
                                    </DetailItem>
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.exams}>
                                        <OptionChips values={selected.exams} labels={EXAM_LABELS} />
                                    </DetailItem>
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.academicSupport}>
                                        <OptionChips
                                            values={selected.academicSupport}
                                            labels={ACADEMIC_SUPPORT_LABELS}
                                        />
                                    </DetailItem>
                                </dl>
                            </section>

                            <section className="pt-4 border-t border-border">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Other Answers
                                </h4>
                                <dl className="grid gap-4 sm:grid-cols-2">
                                    {selected.registrationType === 'teacher' && (
                                        <DetailItem label={FEEDBACK_FIELD_LABELS.jobTypes}>
                                            {selected.jobTypes.length > 0
                                                ? selected.jobTypes
                                                      .map((type) => JOB_TYPE_LABELS[type])
                                                      .join(', ')
                                                : 'Not looking'}
                                        </DetailItem>
                                    )}
                                    {selected.registrationType === 'institution' && (
                                        <DetailItem
                                            label={FEEDBACK_FIELD_LABELS.partnershipInterest}
                                        >
                                            {yesNo(selected.partnershipInterest)}
                                        </DetailItem>
                                    )}
                                    <DetailItem label={FEEDBACK_FIELD_LABELS.productDemoInterest}>
                                        {yesNo(selected.productDemoInterest)}
                                    </DetailItem>
                                    <DetailItem label="Last Updated">
                                        {formatDate(selected.updatedAt)}
                                    </DetailItem>
                                </dl>
                            </section>

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
                                <DialogTitle className="text-xl">Delete Submission?</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete the submission from{' '}
                                    <span className="font-semibold text-foreground">
                                        {deleteTarget.name}
                                    </span>{' '}
                                    (Ref. {deleteTarget.trackingId})? This action cannot be undone.
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
