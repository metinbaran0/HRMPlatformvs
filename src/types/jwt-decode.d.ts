declare module 'jwt-decode' {
  export interface JwtPayload {
    role: string;
    exp?: number;
    iat?: number;
  }

  // Named export şeklinde düzenliyoruz
  export function jwtDecode<T>(token: string): T;
}
