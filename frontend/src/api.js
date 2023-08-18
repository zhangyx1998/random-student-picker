/**
 * The three numbers used to show the participation history of a subject.
 * @typedef {{total: number, credited: number, skipped: number}} Participation
 */
import { Request, TextRequest, JSONRequest } from '@CL/request';
/**
 * Check current authentication state.
 * @type {() => Promise<'OK' | 'WEBAPP' | Error>}
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
/**
 * Get the list of all candidates in the pool.
 * @returns {Promise<{
 *  sid: string,
 *  name: string,
 *  participation: Participation
 * }[] | Error>}
 */
export async function getStudentList() {
    const
        api = new Request('/students'),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
}

/**
 * Initiate a random session for predefined student.
 * @param {string} Student ID
 * @returns {Promise<string>} Assigned Request token
 */
// export const insertPickRecord = new Request('/random', { method: 'POST' })

/**
 * Initiate a random session.
 * @returns {Promise<string>} Assigned record token
 */
export async function createRandRecord() {
    const
        api = new Request('/random'),
        response = await api.request();
    return response.ok ? await response.text() : api.error;
}

/**
 * Get the record of a random session.
 * @param {string} token Random Session Token
 * @returns {Promise<{
 *  timestamp: number,
 *  sid: string,
 *  credited: boolean,
 *  comment: string
 *  } | Error>} record Session record
 */
export async function getRandRecord(token) {
    const
        api = new Request(`/random/${token}`),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
}

/**
 * Update the record of a random session.
 * @param {string} token Random Session Token
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function setRandRecord(token, record) {
    const
        api = new JSONRequest(`/random/${token}`, { method: 'POST' }),
        response = await api.request(record);
    return response.ok || api.error;
}

/**
 * Update the record of a random session.
 * @param {string} token Random Session Token
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function deleteRandRecord(token) {
    const
        api = new JSONRequest(`/random/${token}`, { method: 'DELETE' }),
        response = await api.request();
    return response.ok || api.error;
}


/**
 * Initiate a random session for predefined student.
 * @param {string} Student ID
 * @returns {Promise<string>} Assigned Request token
 */
// export const insertPickRecord = new Request('/random', { method: 'POST' })

/**
 * Initiate a random session.
 * @returns {Promise<string>} Assigned record token
 */
export async function createStudent(info) {
    const
        api = new JSONRequest('/students', { method: 'PUT' }),
        response = await api.request(info);
    return response.ok || api.error;
}

/**
 * Get the info of a student.
 * @param {string} sid Student ID
 * @returns {Promise<{
 *  timestamp: number,
 *  sid: string,
 *  credited: boolean,
 *  comment: string
 *  } | Error>} record Session record
 */
export async function getStudentInfo(sid) {
    const
        api = new Request(`/students/${sid}`),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
}

/**
 * Update the info of a student.
 * @param {string} sid Student ID
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function setStudentInfo(sid, info) {
    const
        api = new JSONRequest(`/students/${sid}`, { method: 'POST' }),
        response = await api.request(info);
    return response.ok ? await response.json() : api.error;
}

/**
 * Update the info of a student.
 * @param {string} sid Student ID
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function deleteStudentInfo(sid) {
    const
        api = new JSONRequest(`/students/${sid}`, { method: 'DELETE' }),
        response = await api.request();
    return response.ok || api.error;
}
