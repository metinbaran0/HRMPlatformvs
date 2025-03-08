export interface User {
  id: string;
  name: string;
  role: 'COMPANY_ADMIN' | 'USER' | 'ADMIN';
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  user: User;
}

export interface CommentsResponse {
  data: Comment[];
  isLoading: boolean;
  error: string | null;
} 