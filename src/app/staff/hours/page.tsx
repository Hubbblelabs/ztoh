
'use client';

import React, { useEffect, useState } from 'react';
import { Clock, TrendingUp, Calendar, CalendarDays, BookOpen, Plus, X, Check, Search, Users, User, Edit2, Trash2 } from 'lucide-react';
import Loader from '@/components/ui/Loader';

interface TeachingHoursData {
    records: any[];
    summary: {
        daily: number;
        weekly: number;
        monthly: number;
    };
    subjectBreakdown: {
        subject: string;
        course: string | null;
        hours: number;
    }[];
    dateRanges: {
        today: { start: string; end: string };
        week: { start: string; end: string };
        month: { start: string; end: string };
    };
}

interface Group {
    _id: string;
    name: string;
    studentIds: string[];
}

interface Student {
    _id: string;
    name: string;
    email: string;
}

export default function StaffHoursPage() {
    const [teachingData, setTeachingData] = useState<TeachingHoursData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // New state for groups and students
    const [groups, setGroups] = useState<Group[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    // Toggle for selection mode
    const [assignmentType, setAssignmentType] = useState<'group' | 'students'>('group');
    const [searchQuery, setSearchQuery] = useState('');

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        hours: '',
        subject: '',
        course: '',
        description: '',
        groupId: '',
        studentIds: [] as string[]
    });

    const fetchData = async () => {
        try {
            const hoursRes = await fetch('/api/staff/teaching-hours');
            if (hoursRes.ok) {
                const hoursData = await hoursRes.json();
                setTeachingData(hoursData);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchGroupsAndStudents = async () => {
        try {
            const [groupsRes, studentsRes] = await Promise.all([
                fetch('/api/staff/groups'),
                fetch('/api/staff/students')
            ]);

            if (groupsRes.ok) {
                const data = await groupsRes.json();
                setGroups(data.groups);
            }
            if (studentsRes.ok) {
                const data = await studentsRes.json();
                setStudents(data.students);
            }
        } catch (error) {
            console.error('Failed to fetch groups/students:', error);
        }
    };

    useEffect(() => {
        fetchData();
        fetchGroupsAndStudents();
    }, []);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<string | null>(null);

    const resetForm = () => {
        setFormData({
            date: new Date().toISOString().split('T')[0],
            hours: '',
            subject: '',
            course: '',
            description: '',
            groupId: '',
            studentIds: []
        });
        setAssignmentType('group');
        setSearchQuery('');
        setEditingId(null);
    };

    const handleStudentToggle = (studentId: string) => {
        setFormData((prev) => {
            const isSelected = prev.studentIds.includes(studentId);
            if (isSelected) {
                return { ...prev, studentIds: prev.studentIds.filter((id) => id !== studentId) };
            } else {
                return { ...prev, studentIds: [...prev.studentIds, studentId] };
            }
        });
    };

    const handleEdit = (record: any) => {
        setEditingId(record._id);
        const isoDate = new Date(record.date).toISOString().split('T')[0];
        setFormData({
            date: isoDate,
            hours: record.hours.toString(),
            subject: record.subject,
            course: record.course || '',
            description: record.description || '',
            groupId: record.groupId || '',
            studentIds: record.studentIds || []
        });

        if (record.groupId) {
            setAssignmentType('group');
        } else if (record.studentIds && record.studentIds.length > 0) {
            setAssignmentType('students');
        }

        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        setRecordToDelete(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!recordToDelete) return;

        try {
            const res = await fetch(`/api/staff/teaching-hours/${recordToDelete}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchData();
                setShowDeleteModal(false);
                setRecordToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting record:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...formData,
                groupId: assignmentType === 'group' ? formData.groupId : undefined,
                studentIds: assignmentType === 'students' ? formData.studentIds : undefined
            };

            const url = editingId
                ? `/api/staff/teaching-hours/${editingId}`
                : '/api/staff/teaching-hours';

            const method = editingId ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setShowModal(false);
                resetForm();
                fetchData();
            }
        } catch (error) {
            console.error('Error submitting hours:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                        <Clock className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">My Teaching Hours</h1>
                        <p className="text-slate-500">Track your teaching activity</p>
                    </div>
                </div>
                <button
                    onClick={() => { resetForm(); setShowModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Log Hours
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 rounded-xl">
                            <Clock className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Today</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.daily.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50 rounded-xl">
                            <Calendar className="text-purple-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">This Week</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.weekly.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 rounded-xl">
                            <CalendarDays className="text-emerald-600" size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">This Month</p>
                            <p className="text-2xl font-bold text-slate-900">
                                {teachingData?.summary.monthly.toFixed(1) || '0'} hrs
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Breakdown */}
            {teachingData?.subjectBreakdown && teachingData.subjectBreakdown.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-violet-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900">This Month by Subject</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Course</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.subjectBreakdown.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="py-3 px-4 text-sm text-slate-900">{item.subject}</td>
                                        <td className="py-3 px-4 text-sm text-slate-500">{item.course || '-'}</td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600">{item.hours.toFixed(1)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Teaching Hours */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-slate-900">All Teaching Hours</h2>
                </div>
                {teachingData?.records && teachingData.records.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Date</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Subject</th>
                                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-600">Attached To</th>
                                    <th className="text-right py-3 px-4 text-sm font-semibold text-slate-600">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachingData.records.map((record) => (
                                    <tr key={record._id} className="border-b border-slate-100 hover:bg-slate-50 group">
                                        <td className="py-3 px-4 text-sm text-slate-900">
                                            {formatDate(record.date)}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-900">
                                            <div className="font-medium">{record.subject}</div>
                                            <div className="text-xs text-slate-500">{record.course}</div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-slate-500">
                                            {record.groupId ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                                                    <Users size={12} />
                                                    Group
                                                </span>
                                            ) : (record.studentIds && record.studentIds.length > 0) ? (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium">
                                                    <User size={12} />
                                                    {record.studentIds.length} Student{record.studentIds.length !== 1 ? 's' : ''}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">Subject only</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-right">
                                            <span className="font-semibold text-emerald-600 block mb-1">{record.hours.toFixed(1)}</span>
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(record)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(record._id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p>No teaching hours recorded yet.</p>
                    </div>
                )}
            </div>

            {/* Large Log Hours Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{editingId ? 'Edit Teaching Hours' : 'Log Teaching Hours'}</h2>
                                <p className="text-sm text-slate-500">Record your session details</p>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 md:p-8">
                            <form id="log-hours-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">

                                {/* Left Column: Log Details */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Session Details</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Hours *</label>
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0.5"
                                                required
                                                value={formData.hours}
                                                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                                                className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                                placeholder="e.g. 1.5"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. Mathematics"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Course / Level</label>
                                        <input
                                            type="text"
                                            value={formData.course}
                                            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="e.g. Grade 10 - Advanced"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none h-32"
                                            placeholder="Optional: What topics were covered?"
                                        />
                                    </div>
                                </div>

                                {/* Right Column: Dynamic Selection with Tabs */}
                                <div className="space-y-6 flex flex-col">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <h3 className="text-sm font-bold text-slate-900">Who is this for?</h3>
                                    </div>

                                    {/* Custom Tab Selector */}
                                    <div className="flex p-1 bg-slate-100/80 rounded-xl">

                                        <button
                                            type="button"
                                            onClick={() => setAssignmentType('group')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${assignmentType === 'group' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <Users size={16} />
                                            Group
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setAssignmentType('students')}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${assignmentType === 'students' ? 'bg-white shadow text-blue-700' : 'text-slate-500 hover:text-slate-700'
                                                }`}
                                        >
                                            <User size={16} />
                                            Students
                                        </button>
                                    </div>

                                    {/* Content Area */}
                                    <div className="flex-1 min-h-[300px] border border-slate-200 rounded-xl p-4 bg-slate-50/50 overflow-hidden flex flex-col">

                                        {assignmentType === 'group' && (
                                            <div className="flex flex-col h-full">
                                                <div className="mb-3 relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        placeholder="Search groups..."
                                                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                    />
                                                </div>
                                                <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                                                    {groups.map(group => (
                                                        <label key={group._id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all bg-white ${formData.groupId === group._id
                                                            ? 'border-blue-500 ring-1 ring-blue-500'
                                                            : 'border-slate-200 hover:border-blue-300'
                                                            }`}>
                                                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${formData.groupId === group._id ? 'border-blue-500 bg-blue-500' : 'border-slate-300'
                                                                }`}>
                                                                {formData.groupId === group._id && <div className="w-2 h-2 bg-white rounded-full" />}
                                                            </div>
                                                            <input
                                                                type="radio"
                                                                name="group"
                                                                className="hidden"
                                                                value={group._id}
                                                                checked={formData.groupId === group._id}
                                                                onChange={(e) => setFormData({ ...formData, groupId: e.target.value })}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="font-semibold text-slate-900 truncate">{group.name}</div>
                                                                <div className="text-xs text-slate-500">{group.studentIds.length} members</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                    {groups.length === 0 && (
                                                        <div className="text-center py-8 text-slate-400 text-sm">No groups found</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {assignmentType === 'students' && (
                                            <div className="flex flex-col h-full">
                                                <div className="mb-3 relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={searchQuery}
                                                        onChange={(e) => setSearchQuery(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100"
                                                        placeholder="Search students..."
                                                    />
                                                </div>
                                                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                                                    {filteredStudents.map(student => (
                                                        <label key={student._id} className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border bg-white ${formData.studentIds.includes(student._id)
                                                            ? 'border-blue-500 ring-1 ring-blue-500'
                                                            : 'border-slate-100 hover:border-blue-200'
                                                            }`}>
                                                            <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${formData.studentIds.includes(student._id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
                                                                }`}>
                                                                {formData.studentIds.includes(student._id) && <Check size={10} className="text-white" />}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={formData.studentIds.includes(student._id)}
                                                                onChange={() => handleStudentToggle(student._id)}
                                                            />
                                                            <div className="min-w-0">
                                                                <div className="text-sm font-medium text-slate-700 truncate">{student.name}</div>
                                                                <div className="text-xs text-slate-400 truncate">{student.email}</div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                    {filteredStudents.length === 0 && (
                                                        <div className="text-center py-8 text-slate-400 text-sm">No students found</div>
                                                    )}
                                                </div>
                                                <div className="pt-3 mt-auto border-t border-slate-200">
                                                    <div className="flex justify-between items-center text-xs text-slate-500">
                                                        <span>Selected: <span className="font-semibold text-blue-600">{formData.studentIds.length}</span></span>
                                                        {formData.studentIds.length > 0 && (
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, studentIds: [] })}
                                                                className="text-red-500 hover:underline"
                                                            >
                                                                Clear all
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="log-hours-form"
                                disabled={submitting || (assignmentType === 'group' && !formData.groupId) || (assignmentType === 'students' && formData.studentIds.length === 0)}
                                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? <Loader className="w-4 h-4" /> : <Clock size={18} />}
                                {editingId ? 'Update Hours' : 'Log Hours'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 opacity-100">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Log?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this teaching hour log? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setRecordToDelete(null);
                                    }}
                                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Delete Log
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
