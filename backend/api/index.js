import express from 'express';
import CookieParser from 'cookie-parser';
import BodyParser from 'body-parser';
import { env } from 'lib';
import authServer, { auth } from './auth.js';
import studentServer from './student.js';
import recordServer from './record.js';
import randomServer from './random.js';
export const cookieParser = CookieParser();
// Patch express.response with a text() method
Object.defineProperty(
    express.response, 'text',
    {
        value(text) {
            this.setHeader('Content-Type', 'text/plain');
            this.send(text);
        }
    }
);
/**
 * Handler for all incoming HTTP requests
 */
export default express()
    .use(cookieParser, BodyParser.json(), BodyParser.text())
    .use(authServer)
    .use(auth(randomServer))
    .use(auth(recordServer))
    .use(auth(studentServer))
    // Unmatched routes are redirected to static assets.
    .use(express.static(env.path.static, { pwa: true }));
