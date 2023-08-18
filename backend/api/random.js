import express from 'express';
// Custom modules
import { util, students, requests, FileDB, logger } from 'lib';
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
export function newRequest(sid, args = {}) {
    return {
        sid,
        timestamp: Date.now(),
        manual: false,
        credit: false,
        comment: '',
        ...args
    };
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createRandomSession(req, res) {
    const
        params = typeof req.body === 'object' ? req.body : {},
        { weighted = true, exclude = [] } = params,
        pool = Object.fromEntries(FileDB.keys(students).map(sid => [sid, 1]));
    // Accumulate request history
    if (weighted) {
        for (const [token, { sid }] of FileDB.iter(requests)) {
            if (sid in pool) pool[sid] += 1;
            else logger.warn(`Invalid sid '${sid}' in request <${token}>`);
        }
    }
    // Exclude students
    for (const sid of exclude) {
        if (sid in pool) delete pool[sid];
        else logger.warn(`Invalid sid '${sid}' in exclude list`);
    }
    // Allocate weights
    if (weighted) {
        const average = util.average(...Object.values(pool));
        for (const sid in pool) {
            // Count starts from 1, divide by zero is impossible
            pool[sid] = average / pool[sid];
        }
    }
    // Do the random pick
    const
        total = util.sum(...Object.values(pool)),
        pick = Math.random() * total;
    // Find the picked student
    let acc = 0;
    for (const sid of Object.keys(pool).sort()) {
        acc += pool[sid];
        if (acc >= pick) {
            const
                insert = FileDB.insert(requests),
                token = insert(newRequest(sid));
            logger.info(`New random request <${token}> created for sid:${sid}`);
            return res.text(token);
        }
    }
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function insertManualSession(req, res) {
    // Extract request body
    const content = req.body;
    if (typeof content !== 'object') {
        return res.status(400).text('Invalid request body');
    }
    // Extract and validate sid from request body
    const { sid, ...args } = content;
    if (typeof sid !== 'string' || !(sid in students)) {
        return res.status(400).text('Invalid sid');
    }
    // Insert request into FileDB
    const
        insert = FileDB.insert(requests),
        token = insert(newRequest(sid, { manual: true, ...args }));
    logger.info(`New manual request <${token}> created for sid:${sid}`);
    return res.text(token);
}
/**
 * Extract and validate token in given request
 * @param {express.Request} req
 * @returns
 */
function extractToken(req, res) {
    const { token } = req.params;
    if (token && typeof token === 'string' && token in requests) return token;
    else res.status(404).text('Invalid token');
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function getRandomSession(req, res) {
    const token = extractToken(req, res);
    if (!token) return;
    res.json(requests[token]);
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function updateRandomSession(req, res) {
    const token = extractToken(req, res);
    if (!token) return;
    // Extract request body
    const content = req.body;
    if (typeof content !== 'object') {
        return res.status(400).text('Invalid request body');
    }
    // Update request in FileDB
    requests[token] = Object.assign(requests[token], content);
    // Log update
    logger.info(`Request <${token}> updated, fields modified: ${Object.keys(content).join(', ')}`);
    // Respond OK
    res.status(200).end();
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function deleteRandomSession(req, res) {
    const token = extractToken(req, res);
    if (!token) return;
    // Perform deletion
    delete requests[token];
    // Log deletion
    logger.info(`Request <${token}> deleted`);
    // Respond OK
    res.status(200).end();
}


export default express()
    // Session creation
    .get('/random', createRandomSession)
    .post('/random', insertManualSession)
    // Session management
    .get('/random/:token', getRandomSession)
    .post('/random/:token', updateRandomSession)
    .delete('/random/:token', deleteRandomSession);
