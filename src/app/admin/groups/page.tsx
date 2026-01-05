"use client";

import { useState, useEffect } from "react";
import {
    Users,
    Plus,
    Search,
    Trash2,
    Check,
    X,
    Edit2,
    Save,
    User,
    GraduationCap
} from "lucide-react";
import Loader from "@/components/ui/Loader";

interface Student {
    _id: string;
    name: string;
    email: string;
}

interface Staff {
    _id: string;
    name: string;
    email: string;
}

interface Group {
    _id: string;
    name: string;
    staffIds: Staff[]; // Changed to array
    studentIds: Student[];
    description?: string;
    createdAt?: string;
}

export default function AdminGroupsPage() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [staffList, setStaffList] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        staffIds: [] as string[],
        studentIds: [] as string[],
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [groupsRes, studentsRes, staffRes] = await Promise.all([
                fetch("/api/admin/groups"),
                fetch("/api/admin/students"),
                fetch("/api/admin/staff")
            ]);

            if (groupsRes.ok && studentsRes.ok && staffRes.ok) {
                const groupsData = await groupsRes.json();
                const studentsData = await studentsRes.json();
                const staffData = await staffRes.json();
                setGroups(groupsData.groups);
                setStudents(studentsData.students);
                setStaffList(staffData.staff);
            }
        } catch (error) {
            console.error("Failed to fetch data", error);
            showToast("Failed to load data", "error");
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const resetForm = () => {
        setFormData({ name: "", description: "", staffIds: [], studentIds: [] });
        setEditingGroupId(null);
        setShowCreateModal(false);
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

    const handleStaffToggle = (staffId: string) => {
        setFormData((prev) => {
            const isSelected = prev.staffIds.includes(staffId);
            if (isSelected) {
                return { ...prev, staffIds: prev.staffIds.filter((id) => id !== staffId) };
            } else {
                return { ...prev, staffIds: [...prev.staffIds, staffId] };
            }
        });
    };

    const handleEdit = (group: Group) => {
        setFormData({
            name: group.name,
            description: group.description || "",
            staffIds: group.staffIds.map(s => s._id),
            studentIds: group.studentIds.map(s => s._id),
        });
        setEditingGroupId(group._id);
        setShowCreateModal(true);
    };

    const handleDelete = (groupId: string) => {
        setGroupToDelete(groupId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!groupToDelete) return;

        try {
            const res = await fetch(`/api/admin/groups/${groupToDelete}`, {
                method: "DELETE",
            });

            if (res.ok) {
                showToast("Group deleted successfully", "success");
                fetchData();
                setShowDeleteModal(false);
                setGroupToDelete(null);
            } else {
                showToast("Failed to delete group", "error");
            }
        } catch (error) {
            showToast("An error occurred", "error");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const url = editingGroupId
                ? `/api/admin/groups/${editingGroupId}`
                : "/api/admin/groups";
            const method = editingGroupId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                showToast(editingGroupId ? "Group updated successfully!" : "Group created successfully!", "success");
                fetchData();
                resetForm();
            } else {
                const data = await res.json();
                showToast(data.error || "Failed to save group", "error");
            }
        } catch (error) {
            showToast("An error occurred", "error");
        } finally {
            setSubmitting(false);
        }
    };

    // Filter students for selection based on search in modal
    const [studentSearch, setStudentSearch] = useState("");
    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(studentSearch.toLowerCase())
    );

    // Filter staff for selection based on search in modal
    const [staffSearch, setStaffSearch] = useState("");
    const filteredStaff = staffList.filter(s =>
        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.email.toLowerCase().includes(staffSearch.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
                        <div className="h-4 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"></div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 h-48 animate-pulse flex flex-col justify-between">
                            <div className="flex justify-between items-start">
                                <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                                    <div className="w-8 h-8 bg-slate-100 rounded-lg"></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="h-6 w-3/4 bg-slate-100 rounded-lg"></div>
                                <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
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
                <div className={`fixed bottom-4 right-4 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 ${toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white'} transition-all duration-300`}>
                    {toast.type === 'success' ? <Check size={18} /> : <X size={18} />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Student Groups</h1>
                    <p className="text-slate-500">Manage groups and assign to teachers</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Create Group
                </button>
            </div>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.length === 0 ? (
                    <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-dashed border-slate-300">
                        <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-slate-900">No Groups Yet</h3>
                        <p className="text-slate-500 mb-6 max-w-sm mx-auto">Create groups to organize students under teachers.</p>
                        <button
                            onClick={() => {
                                resetForm();
                                setShowCreateModal(true);
                            }}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                        >
                            Create Group
                        </button>
                    </div>
                ) : (
                    groups.map((group) => (
                        <div key={group._id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-sky-50 rounded-xl">
                                    <Users className="w-6 h-6 text-sky-600" />
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        onClick={() => handleEdit(group)}
                                        className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-sky-600 transition-colors"
                                        title="Edit Group"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(group._id)}
                                        className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                                        title="Delete Group"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1">{group.name}</h3>
                            <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">
                                {group.description || "No description provided"}
                            </p>

                            <div className="mb-4 flex flex-col gap-2 p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm text-slate-600 font-medium">Teachers ({group.staffIds?.length || 0})</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {group.staffIds?.length > 0 ? (
                                        group.staffIds.map(staff => (
                                            <span key={staff._id} className="text-xs px-2 py-1 bg-white border border-slate-200 rounded-md text-slate-700">
                                                {staff.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Students</span>
                                    <span className="px-2 py-1 bg-slate-100 text-slate-700 font-semibold rounded-md">
                                        {group.studentIds.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">{editingGroupId ? "Edit Group" : "Create New Group"}</h2>
                                <p className="text-sm text-slate-500">{editingGroupId ? "Update group details" : "Organize students and assign to staff"}</p>
                            </div>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto flex-1">
                            <form id="create-group-form" onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Group Name *</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all placeholder:text-slate-300"
                                                placeholder="e.g. Class 10-A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none placeholder:text-slate-300"
                                                placeholder="Optional details..."
                                            />
                                        </div>

                                        <div className="flex flex-col h-full min-h-[300px] border border-slate-200 rounded-xl overflow-hidden mt-4">
                                            <div className="p-3 bg-slate-50 border-b border-slate-200">
                                                <label className="text-sm font-medium text-slate-700 mb-2 block">
                                                    Assign Teachers ({formData.staffIds.length}) *
                                                </label>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                    <input
                                                        type="text"
                                                        value={staffSearch}
                                                        onChange={(e) => setStaffSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                                                        placeholder="Search teachers..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[200px]">
                                                {filteredStaff.length > 0 ? (
                                                    filteredStaff.map((staff) => (
                                                        <label
                                                            key={staff._id}
                                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.staffIds.includes(staff._id)
                                                                ? 'bg-purple-50 border border-purple-100'
                                                                : 'hover:bg-slate-50 border border-transparent'
                                                                }`}
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.staffIds.includes(staff._id)
                                                                ? 'bg-purple-600 border-purple-600'
                                                                : 'border-slate-300 bg-white'
                                                                }`}>
                                                                {formData.staffIds.includes(staff._id) && <Check size={12} className="text-white" />}
                                                            </div>
                                                            <input
                                                                type="checkbox"
                                                                className="hidden"
                                                                checked={formData.staffIds.includes(staff._id)}
                                                                onChange={() => handleStaffToggle(staff._id)}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-sm font-medium text-slate-900 truncate">{staff.name}</div>
                                                                <div className="text-xs text-slate-500 truncate">{staff.email}</div>
                                                            </div>
                                                        </label>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 text-slate-400 text-sm">
                                                        No teachers found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col h-full min-h-[300px] border border-slate-200 rounded-xl overflow-hidden">
                                        <div className="p-3 bg-slate-50 border-b border-slate-200">
                                            <label className="text-sm font-medium text-slate-700 mb-2 block">
                                                Select Students ({formData.studentIds.length})
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={studentSearch}
                                                    onChange={(e) => setStudentSearch(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-sky-500"
                                                    placeholder="Search students..."
                                                />
                                            </div>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                                            {filteredStudents.length > 0 ? (
                                                filteredStudents.map((student) => (
                                                    <label
                                                        key={student._id}
                                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${formData.studentIds.includes(student._id)
                                                            ? 'bg-sky-50 border border-sky-100'
                                                            : 'hover:bg-slate-50 border border-transparent'
                                                            }`}
                                                    >
                                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.studentIds.includes(student._id)
                                                            ? 'bg-sky-600 border-sky-600'
                                                            : 'border-slate-300 bg-white'
                                                            }`}>
                                                            {formData.studentIds.includes(student._id) && <Check size={12} className="text-white" />}
                                                        </div>
                                                        <input
                                                            type="checkbox"
                                                            className="hidden"
                                                            checked={formData.studentIds.includes(student._id)}
                                                            onChange={() => handleStudentToggle(student._id)}
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm font-medium text-slate-900 truncate">{student.name}</div>
                                                            <div className="text-xs text-slate-500 truncate">{student.email}</div>
                                                        </div>
                                                    </label>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-slate-400 text-sm">
                                                    No students found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-2xl flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(false)}
                                className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="create-group-form"
                                disabled={submitting || !formData.name || formData.staffIds.length === 0}
                                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {submitting ? <Loader className="w-4 h-4" /> : <Save size={18} />}
                                {editingGroupId ? "Update Group" : "Create Group"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Group?</h3>
                            <p className="text-slate-500 mb-6">
                                Are you sure you want to delete this group? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => {
                                        setShowDeleteModal(false);
                                        setGroupToDelete(null);
                                    }}
                                    className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-sm"
                                >
                                    Delete Group
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
