export type CameraStatus = 'active' | 'inactive' | 'error';

export interface Camera {
  id?: string;
  _id?: string; 
  location: string;
  feedUrl: string;
  status: 'active' | 'inactive';
}

export type EventStatus = 'pending' | 'confirmed' | 'dismissed';

export interface Alert {
  id: string;
  _id?: string;
  cameraId: string;
  cameraLocation: string;
  type: string;
  description: string;
  timestamp: string;
  status: EventStatus;
  imageUrl: string;
  assignedTo?: string;
}

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  _id: string;
  username: string;
  role: UserRole;
  fullName: string;
  email?: string;
  assignedCameras?: string[];
}

export interface NewUser {
  username: string;
  password: string;
  email: string;
  fullName: string; // ✅ תוסיפי את זה
  role: 'user' | 'admin';
}