/**
 * The three numbers used to show the participation history of a student.
 * @typedef {{total: number, credited: number, skipped: number}} Participation
 */
import { Request, TextRequest } from '@CL/request';
/**
 * Check current authentication state.
 * @type {() => Promise<'SERVER' | 'WEBAPP' | Error>}
 */
export async function checkAuthState() {
    const
        api = new Request('/auth', { method: 'GET' }),
        response = await api.request();
    return response.ok ? await response.text() : api.error;
}
/**
 * Login to current server.
 * @param {string} password Login Password
 * @type {() => Promise<Boolean | Error>} True if logged in successfully
 */
export async function login(password) {
    const
        api = new TextRequest('/login', { method: 'POST' }),
        response = await api.request(password);
    return response.ok || api.error;
}
/**
 * Logout from current server.
 * @type {() => Promise<Boolean | Error>} True if logged out successfully
 */
export async function logout() {
    const
        api = new Request('/logout', { method: 'POST' }),
        response = await api.request();
    return response.ok || api.error;
}
