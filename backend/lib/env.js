import { resolve, dirname } from 'path';
import { mkdir } from 'fs/promises';
import { fileURLToPath } from 'url';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

export const port = parseInt(process.env.PORT ?? 8080);

export const proxy = process.env.PROXY ?? undefined;

export const VAR = resolve(root, 'var');

export const path = {
    log: resolve(VAR, 'log'),
    static: resolve(VAR, 'static'),
    password: resolve(VAR, 'password'),
    // FileDB directories
    records: resolve(VAR, 'records'),
    students: resolve(VAR, 'students'),
};

await mkdir(VAR, { recursive: true });
await mkdir(path.records, { recursive: true });
await mkdir(path.students, { recursive: true });
