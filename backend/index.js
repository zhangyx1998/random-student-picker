import { createServer } from 'node:http';
import { WebSocketServer } from 'ws';

import * as env from 'lib/env.js';
import express, { cookieParser } from 'api';
import { util, logger } from 'lib';
import { websocketTransport } from 'lib/logger.js';
import { checkAuthToken } from 'api/auth.js';
// Startup message
logger.info(`Server launched with PID ${process.pid}`);
// Initialize websocket Server
const wss = new WebSocketServer({ noServer: true });
// Configure websocket server
wss.on('connection', (socket, request) => {
    websocketTransport.register(socket);
    logger.info(`Websocket ${request.url} connected from ${util.realIP(request)}`);
});
// Create server
const server = createServer();
// Upgrade HTTP requests to WebSocket connections
server.on('upgrade', (request, socket, head) => {
    cookieParser(request, socket, () => { });
    if (checkAuthToken(request)) {
        wss.handleUpgrade(
            request, socket, head,
            (...args) => wss.emit('connection', ...args)
        );
    } else {
        // End response with 401/Unauthorized
        logger.warn(`Unauthorized websocket connection to ${request.url} from ${util.realIP(request)}`);
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
    }
});
// Handle normal requests
server.on('request', (req, res) => {
    logger.verbose([req.method, req.url.toString(), 'from', util.realIP(req)].join(' '));
    express.handle(req, res);
});
server.listen(env.port, () => {
    logger.info(`Server listening on port ${env.port}`);
});
