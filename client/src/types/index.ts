export interface UserSession {
  id: string;
  name: string;
  email: string;
}

export interface DocumentSchema {
  id: string;
  title: string;
  fileUrl: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED';
  rejectReason?: string | null;
  createdAt: string;
  ownerId: string;
}