import express from 'express';
// Custom modules
import { util, logger, students, requests, FileDB } from 'lib';
// API Callbacks
/**
 * Formulate list of all students,
 * with participation statistics.
 * @param {express.Request} req
 * @param {express.Response} res
 */
export async function getStudentList(req, res) {
    // Build participation statistics using all records
    const index = {};
    for (const [token, content] of FileDB.iter(requests)) {
        const { sid, credited = false } = content;
        // Validate type and existence of given sid
        if (typeof sid !== 'string' || !(sid in students)) {
            logger.warn(`Invalid sid '${sid}' in request <${token}>`);
        }
        // Create index for sid if not exists
        if (!(sid in index)) {
            index[sid] = [0, 0];
        }
        // Accumulate participation record
        index[sid][0] += 1;
        index[sid][1] += credited ? 1 : 0;
    }
    // Compose final list
    const result = Object.fromEntries(
        [...FileDB.iter(students)]
            .map(([sid, { name }]) => [
                sid, {
                    name,
                    stat: index[sid] ?? [0, 0],
                }
            ])
    );
    // Send response
    res.json(result);
}
/**
 * Pull up the summary of a student.
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function getStudentSummary(req, res) {
    const { sid } = req.params;
    // Validate sid
    if (typeof sid !== 'string') {
        return res.status(400).end('Invalid sid');
    }
    // Check if sid exists
    if (!(sid in students)) {
        return res.status(404).end('Student not found');
    }
    // Get student info
    const student = students[sid];
    // Get participation record
    const
        record = FileDB.iter(requests, (k, v) => v?.sid === sid),
        stat = [0, 0];
    // Compute statistics
    for (const [_, request] of record) {
        const { credited = false } = request;
        stat[0] += 1;
        stat[1] += credited ? 1 : 0;
    }
    // Send response
    res.json({
        name: student.name,
        meta: student.meta,
        record,
        stat
    });
}

export default express()
    .get('/students', util.no_cache, util.wrap(getStudentList))
    .get('/students/:sid', util.no_cache, util.wrap(getStudentSummary));
