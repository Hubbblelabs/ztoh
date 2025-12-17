export interface ContactRequest {
    _id: string;
    name: string;
    email: string;
    message: string;
    status: 'pending' | 'accepted' | 'declined';
    teleCallingStatus: 'pending' | 'called' | 'no_answer' | 'follow_up_needed' | 'converted' | 'not_interested';
    notes: { content: string; createdAt: string }[];
    history: { action: string; details: string; performedBy: string; timestamp: string }[];
    createdAt: string;
    trackingId?: string;
}

export interface JoinRequest {
    _id: string;
    type: 'student' | 'teacher';
    name: string;
    email: string;
    mobile: string;
    status: 'pending' | 'accepted' | 'declined';
    teleCallingStatus: 'pending' | 'called' | 'no_answer' | 'follow_up_needed' | 'converted' | 'not_interested';
    notes: { content: string; createdAt: string }[];
    history: { action: string; details: string; performedBy: string; timestamp: string }[];
    createdAt: string;
    trackingId?: string;
    [key: string]: any;
}

export interface AdminUser {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}
