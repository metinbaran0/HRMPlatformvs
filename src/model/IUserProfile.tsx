export interface IUserProfile { 
    id?: number;
    email: string;
    password: string;
    rePassword: string;
    role: 'SITE_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE';
  }
  