import { readFile } from 'fs/promises';
import express from 'express';
// Custom modules
import { env, util, logger } from 'lib';
/**
 * @type {{[String]: Number}} Timestamp of last active request
 */
const session = {};

function newToken() {
    let token;
    do {
        token = util.randomString(12);
    } while (token in session);
    return token;
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function login(req, res) {
    // Extract password from request body (plain text)
    const remotePassword = req.body.toString();
    // Compare password with local file
    const localPassword = (await readFile(env.path.password)).toString();
    if (remotePassword.trim() === localPassword.trim()) {
        // Generate random token
        const token = newToken();
        // Add token to session
        session[token] = Date.now();
        // Assign session token to response header
        res.cookie('token', token, { httpOnly: true });
        res.writeHead(200, { 'X-Session-Token': token });
        // End response with 200/OK
        res.end();
        // Log successful attempt
        logger.info(`Successful login from ${util.realIP(req)}`);
    } else {
        // Log unsuccessful attempt
        logger.warn(`Unsuccessful login attempt from ${util.realIP(req)}`);
        // End response with 401/Unauthorized
        res.writeHead(401).end('Wrong Password');
    }
}
/**
 * @param {express.Request} req
 * @param {express.Response} res
 */
async function logout(req, res) {
    // Extract token from request header
    const { token } = req.cookies || {};
    // Remove token from session
    if (token && token in session) delete session[token];
    // Unset the token cookie
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    // End response with 200/OK
    res.writeHead(200).end();
}
/**
 * Checks if the token in the request is valid.
 * @param {express.Request} req
 * @returns
 */
export function checkAuthToken(req) {
    const token = req?.cookies?.token;
    if (token && token in session) {
        // Update last active timestamp
        session[token] = Date.now();
        return true;
    } else {
        return false;
    }
}
/**
 * This function is a wrapper.
 * Create an authentication gateway before accessing
 * its enclosed API services.
 * Unauthorized requests will be passed to other handlers.
 * @param  {...express} services
 * @returns
 */
export function auth(...services) {
    const protectedServices = express().use(...services);
    let flagStrict = false;
    /**
     * @param {express.Request} req
     * @param {express.Response} res
     * @param {express.NextFunction} next
     */
    function checkAuthorization(req, res, next) {
        // Check if token is valid
        if (checkAuthToken(req)) {
            // Continue to protected API
            protectedServices.handle(req, res, next);
        } else {
            if (flagStrict) {
                logger.info(`Unauthorized request from ${util.realIP(req)}`);
                // End response with 401/Unauthorized
                res.writeHead(401).end();
            } else {
                // Enclosing services are invisible to this request
                next();
            }
        }
    }
    // Inject strict() method
    checkAuthorization.strict = function(strict = true) {
        flagStrict = strict;
        return checkAuthorization;
    };
    // Return the injected function
    return checkAuthorization;
}

export default express()
    .post('/login', util.wrap(login))
    .post('/logout', util.wrap(logout))
    // Confirm client's authorization state
    .get('/auth', util.no_cache, auth((req, res) => res.send('OK')).strict());
