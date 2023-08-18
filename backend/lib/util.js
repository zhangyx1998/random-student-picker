import crypto from 'crypto';
import { logger } from 'lib';

export function randomString(length = 12) {
    const
        bytes = Math.ceil(length * 6 / 8),
        buf = Buffer.alloc(bytes);
    crypto.getRandomValues(buf);
    return buf.toString('hex').slice(0, length).toUpperCase();
}

function defaultServerErrorHandler(err, req, res, next) {
    logger.error(err.stack);
    res.status(500).end();
}
/**
 * Warp async function or promise with a fallback error handler
 * @param {import('express').Handler} fn
 * @param {String} name
 * Name of the wrapped function, defaults to the input function name
 * Can accept any Function or Promise
 * @param {Function} handler Error handler for the async function/promise
 * @returns {Function | Promise}
 */
export function wrap(fn, name = fn?.name, handler = defaultServerErrorHandler) {
    if (fn instanceof Promise) {
        return fn.catch(handler);
    }
    return setFunctionName(
        async function(...args) {
            try {
                return await fn(...args);
            } catch (e) {
                handler(e, ...args);
            }
        },
        name
    );
}
/**
 * Set name of a function to given name
 * @param {Function} fn
 * @param {String} name
 * @returns
 */
export function setFunctionName(fn, name = fn?.name) {
    Object.defineProperty(fn, 'name', { value: name });
    return fn;
}
/**
 * Checks for real IP of the remote client
 * @param {import('express').Request} request
 */
export function realIP(request) {
    return (
        request.headers['x-forwarded-for']
        ?? request.headers['X-Forwarded-For']
        ?? request.headers['x-real-ip']
        ?? request.headers['X-Real-IP']
        ?? request.remoteAddress
        ?? request.socket.remoteAddress
    );
}

/**
 * Report a function as not implemented
 */
export function NotImplemented(name = '', ...args) {
    logger.warn(`Module "${name}" Not implemented`);
    logger.debug(`Arguments: ${args}`);
    logger.debug(
        (new Error).stack
            .split('\n')
            .slice(2)
            .join('\n')
    );
}
/**
 * Add no-cache header to response
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 */
export function no_cache(req, res, next) {
    res.set('Cache-Control', 'no-store');
    next();
}

export function sum(...args) {
    return args.reduce((a, b) => a + b, 0);
}

export function average(...args) {
    return sum(...args) / args.length;
}
