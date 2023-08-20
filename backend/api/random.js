import express from 'express';
// Custom modules
import { util, FileDB, db, logger } from 'lib';
import { Record } from 'api/record.js';
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
function createRandomRecord(req, res) {
    const
        params = typeof req.body === 'object' ? req.body : {},
        { weighted = true, exclude = [] } = params,
        pool = Object.fromEntries(
            FileDB
                .keys(db.student)
                .map(sid => [sid, 1])
        );
    // Check if pool is empty
    if (Object.keys(pool).length === 0) {
        return res.status(404).text('No student on file');
    }
    // Accumulate request history
    if (weighted) {
        for (const [token, { sid }] of FileDB.iter(db.record)) {
            if (sid in pool) pool[sid] += 1;
            else logger.warn(`Invalid sid '${sid}' in request <${token}>`);
        }
    }
    // Exclude students
    for (const sid of exclude) {
        if (sid in pool) delete pool[sid];
        else logger.warn(`Invalid sid '${sid}' in exclude list`);
    }
    // Check if pool is empty
    if (Object.keys(pool).length === 0) {
        // Bad request
        return res.status(400).text('Bad request: All students excluded');
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
            const token = FileDB.insert(
                db.record,
                Record(sid)
            );
            logger.info(`New random request <${token}> created for sid:${sid}`);
            return res.text(token);
        }
    }
}
export default express().get('/random', createRandomRecord);
