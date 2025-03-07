export interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: 'pending' | 'approved' | 'rejected';
    employeeCount: number;
    createdAt: string;
    sector: string;
} 