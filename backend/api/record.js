import express from 'express';
// Custom modules
import { FileDB, db, logger } from 'lib';
/**
 * Create a new request object.
 * @param {string} sid Student ID
 * @param {*} args Additional arguments
 * @returns {{
 *  sid: string,
 *  timestamp: number,
 *  manual: boolean,
 *  credit: boolean,
 *  comment: string,
 *  ...args
 * }}
 */
export function Record(sid, args = {}) {
    return {
        sid,
        timestamp: Date.now(),
        manual: false,
        credited: false,
        comment: '',
        ...args
    };
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createRecord(req, res) {
    // Extract sid from request body
    const sid = req.body;
    // Validate sid
    if (typeof sid !== 'string' || !(sid in db.student)) {
        return res.status(400).text('Invalid sid');
    }
    // Insert request into FileDB
    const token = FileDB.insert(
        db.record,
        Record(sid, { manual: true, credited: true })
    );
    logger.info(`New manual request <${token}> created for sid:${sid}`);
    return res.text(token);
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function getRecordList(req, res) {
    // Index table to cache student names
    const index = {};
    // Iterate through all records
    const result = [];
    for (const [token, content] of FileDB.iter(db.record)) {
        const { sid } = content;
        // Inject token
        content.token = token;
        // Cache student name
        if (!(sid in index)) {
            const { name } = db.student[sid];
            index[sid] = name ?? '[deleted]';
        }
        // Inject student name from cache
        content.name = index[sid];
        // Push to result
        result.push(content);
    }
    return res.json(result);
}
/**
 * Extract and validate token in given request
 * @param {express.Request} req
 * @param {express.Response} res
 */
function validateRecordToken(req, res, next) {
    const { token } = req.params;
    if (!token || typeof token !== 'string') {
        // Validate existence and type of token (Bad request)
        res.status(400).text('Bad token');
    } else if (!(token in db.record)) {
        // Validate existence of request (Not found)
        res.status(404).text('Invalid token');
    } else {
        // Token validated, proceed to next
        next();
    }
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function getRecord(req, res) {
    const { token } = req.params;
    if (!token) return;
    res.json(db.record[token]);
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function updateRecord(req, res) {
    const { token } = req.params;
    if (!token) return;
    // Extract request body
    const content = req.body;
    if (typeof content !== 'object') {
        return res.status(400).text('Invalid request body');
    }
    // Update request in FileDB
    db.record[token] = Object.assign(db.record[token], content);
    // Log update
    logger.info(`Record <${token}> updated, fields modified: ${Object.keys(content).join(', ')}`);
    // Respond OK
    res.status(200).end();
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function deleteRecord(req, res) {
    const { token } = req.params;
    if (!token) return;
    // Perform deletion
    delete db.record[token];
    // Log deletion
    logger.info(`Record <${token}> deleted`);
    // Respond OK
    res.status(200).end();
}


export default express()
    // List all requests, optionally filtered by given sid
    .get('/record/', getRecordList)
    // Session creation
    .put('/record/', createRecord)
    // Session management
    .get('/record/:token', validateRecordToken, getRecord)
    .post('/record/:token', validateRecordToken, updateRecord)
    .delete('/record/:token', validateRecordToken, deleteRecord);
