/**
 * The three numbers used to show the participation history of a student.
 * @typedef {{total: number, credited: number, skipped: number}} Participation
 */
import { Request, JSONRequest } from '@CL/request';

/**
 * Initiate a random session.
 * @returns {Promise<string>} Assigned record token
 */
export async function createStudent(info) {
    const
        api = new JSONRequest('/student', { method: 'PUT' }),
        response = await api.request(info);
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
        api = new Request('/student/'),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
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
        api = new Request(`/student/${sid}`),
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
        api = new JSONRequest(`/student/${sid}`, { method: 'POST' }),
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
        api = new JSONRequest(`/student/${sid}`, { method: 'DELETE' }),
        response = await api.request();
    return response.ok || api.error;
}
