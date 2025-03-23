const apiUrl = import.meta.env.VITE_API_URL;

interface AuthResponse {
    token: string;
    userId: string;
    username: string;
    role: string;
    points: number;
}

const AuthService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${apiUrl}/api/public/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Username " + errorData.username || "Password " + errorData.password || 'An error occurred during login');
        }

        const data = await response.json();
        
        if (data.token) {
            return {
                token: data.token,
                userId: data.userId,
                username: data.username,
                role: data.role,
                points: data.points,
            };
        } else {
            throw new Error('No token returned from login');
        }
    },

    register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
        const response = await fetch(`${apiUrl}/api/public/auth/register`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Username " + errorData.username || "Password " + errorData.password || 'Failed to register');
        }

        const data = await response.json();
        
        if (data.token) {
            return {
                token: data.token,
                userId: data.userId,
                username: data.username,
                role: data.role,
                points: data.points,
            };
        } else {
            throw new Error('No token returned from registration');
        }
    },

    logout: (): void => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        localStorage.removeItem('points');
    },

    isAuthenticated: (): boolean => {
        return !!localStorage.getItem('userToken');
    },

    getToken: (): string | null => {
        return localStorage.getItem('userToken');
    },

    setAuthHeader: (headers: Record<string, string> = {}): Record<string, string> => {
        const token = AuthService.getToken();

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },

    getUserInfo: async (): Promise<any> => {
        const response = await fetch(`${apiUrl}/api/public/auth/userinfo`, {
            credentials: 'include',
            method: 'GET',
            headers: AuthService.setAuthHeader({
                'Content-Type': 'application/json',
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user info');
        }

        return await response.json();
    },
};

export default AuthService;
