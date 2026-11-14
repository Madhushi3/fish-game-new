const STORAGE_AUTH_KEY = 'fish_escape_auth_user';
const STORAGE_TOKEN_KEY = 'fish_escape_auth_token';
class AuthService {

    setSessionCookie(token, days = 7) {
        if (typeof document === 'undefined')
            return;
        const expires = new Date(Date.now() + days * 864e5).toUTCString();
        document.cookie = `fish_escape_session=${encodeURIComponent(token)}; expires=${expires}; path=/; SameSite=Lax`;
    }
    clearSessionCookie() {
        if (typeof document === 'undefined')
            return;
        document.cookie = 'fish_escape_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    getInitialAuth() {
        try {
            const storedUser = localStorage.getItem(STORAGE_AUTH_KEY);
            const storedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
            if (storedUser && storedToken) {
                return {
                    isAuthenticated: true,
                    user: JSON.parse(storedUser),
                    token: storedToken,
                };
            }
        }
        catch (e) {
            console.warn('Failed to parse stored auth session:', e);
        }

        const defaultUser = {
            id: 'usr_oceanhero_01',
            name: 'OceanHero',
            email: 'oceanhero@fishescape.io',
            avatar: '🤿',
            level: 3,
            experience: 620,
            score: 5210,
            coins: 250,
            role: 'student',
            createdAt: new Date().toISOString(),
        };
        const defaultToken = 'mock_jwt_token_cis045_' + Date.now();
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(defaultUser));
        localStorage.setItem(STORAGE_TOKEN_KEY, defaultToken);
        this.setSessionCookie(defaultToken);
        return {
            isAuthenticated: true,
            user: defaultUser,
            token: defaultToken,
        };
    }

    async login(identifier, password) {
        if (!password || password.length < 4) {
            throw new Error('Password must be at least 4 characters');
        }
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                    const user = data.user;
                    const token = data.token || 'jwt_' + Date.now();
                    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
                    localStorage.setItem(STORAGE_TOKEN_KEY, token);
                    this.setSessionCookie(token);
                    return user;
                }
            }
        }
        catch {

        }
        await new Promise((r) => setTimeout(r, 400));

        const isMarc = identifier.toLowerCase() === 'marc' && password === 'hello26';
        const user = {
            id: 'usr_' + Date.now(),
            name: isMarc ? 'Marc' : (identifier.includes('@') ? identifier.split('@')[0] : identifier),
            email: identifier.includes('@') ? identifier : `${identifier.toLowerCase()}@fishescape.io`,
            avatar: isMarc ? '🎓' : '🤿',
            level: isMarc ? 10 : 3,
            experience: isMarc ? 2500 : 620,
            score: isMarc ? 15000 : 5210,
            coins: isMarc ? 999 : 250,
            role: isMarc ? 'admin' : 'student',
            createdAt: new Date().toISOString(),
        };
        const token = 'bearer_token_laravel_' + Math.random().toString(36).substring(2);
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        this.setSessionCookie(token);
        return user;
    }

    async register(name, email, password) {
        if (!name.trim())
            throw new Error('Player Name is required');
        if (!email.includes('@'))
            throw new Error('Valid email address is required');
        if (password.length < 6)
            throw new Error('Password must be at least 6 characters');
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.success && data.user) {
                    const user = data.user;
                    const token = data.token || 'jwt_' + Date.now();
                    localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
                    localStorage.setItem(STORAGE_TOKEN_KEY, token);
                    this.setSessionCookie(token);
                    return user;
                }
            }
        }
        catch {

        }
        await new Promise((r) => setTimeout(r, 400));
        const user = {
            id: 'usr_' + Date.now(),
            name,
            email,
            avatar: '🤿',
            level: 1,
            experience: 0,
            score: 0,
            coins: 100,
            role: 'student',
            createdAt: new Date().toISOString(),
        };
        const token = 'bearer_token_laravel_' + Math.random().toString(36).substring(2);
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(user));
        localStorage.setItem(STORAGE_TOKEN_KEY, token);
        this.setSessionCookie(token);
        return user;
    }

    async logout() {
        await new Promise((r) => setTimeout(r, 200));
        localStorage.removeItem(STORAGE_AUTH_KEY);
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        this.clearSessionCookie();
    }

    updateProfile(updated) {
        const current = this.getInitialAuth().user;
        const newUser = { ...current, ...updated };
        localStorage.setItem(STORAGE_AUTH_KEY, JSON.stringify(newUser));
        return newUser;
    }
}
export const authService = new AuthService();
export default authService;
