/**
 * The three numbers used to show the participation history of a student.
 * @typedef {{total: number, credited: number, skipped: number}} Participation
 */
import { Request, TextRequest, JSONRequest } from '@CL/request';
/**
 * Initiate a random session.
 * @returns {Promise<string>} Assigned record token
 */
export async function createRandomRecord() {
    const
        api = new Request('/random'),
        response = await api.request();
    return response.ok ? await response.text() : api.error;
}

/**
 * Create a record for given student.
 * @param {string} sid Student ID
 * @returns {Promise<string>} Record token
 */
export async function createRecord(sid) {
    const
        api = new TextRequest('/record/', { method: 'PUT' }),
        response = await api.request(sid);
    return response.ok ? await response.text() : api.error;
}

/**
 * Get the record associated with given token.
 * @param {string} token Random Session Token
 * @returns {Promise<{
 *  timestamp: number,
 *  sid: string,
 *  credited: boolean,
 *  comment: string
 *  } | Error>} record Session record
 */
export async function getRecord(token) {
    const
        api = new Request(`/record/${token}`),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
}

/**
 * Get list all records.
 * @param {string} token Random Session Token
 * @returns {Promise<{
 *  timestamp: number,
 *  sid: string,
 *  credited: boolean,
 *  comment: string
 *  }[] | Error>} record Session record
 */
export async function getRecordList() {
    const
        api = new Request('/record/'),
        response = await api.request();
    return response.ok ? await response.json() : api.error;
}

/**
 * Update the record associated with given token.
 * @param {string} token Random Session Token
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function updateRecord(token, record) {
    const
        api = new JSONRequest(`/record/${token}`, { method: 'POST' }),
        response = await api.request(record);
    return response.ok || api.error;
}

/**
 * Update the record associated with given token.
 * @param {string} token Random Session Token
 * @param {{
 *  credited: boolean,
 *  comment: string
 *  }} record Session record
 */
export async function deleteRecord(token) {
    const
        api = new JSONRequest(`/record/${token}`, { method: 'DELETE' }),
        response = await api.request();
    return response.ok || api.error;
}
