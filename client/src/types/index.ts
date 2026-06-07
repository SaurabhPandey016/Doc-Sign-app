export interface UserSession {
  id: string;
  name: string;
  email: string;
}

export interface DocumentSchema {
  id: string;
  title: string;
  fileUrl: string;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  ownerId: string;
}