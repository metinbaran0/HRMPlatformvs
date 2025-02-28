const TokenService = {
  getToken: () => {
    return localStorage.getItem('token');
  },

  setToken: (token: string) => {
    localStorage.setItem('token', token);
  },

  removeToken: () => {
    localStorage.removeItem('token');
  },

  setUserData: (token: string, userId: number, role: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId.toString());
    localStorage.setItem('role', role);
  },

  clearUserData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  },

  getUserRole: () => {
    return localStorage.getItem('role');
  },

  getUserId: () => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getAuthHeader() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : '';
  }
};

export default TokenService; 