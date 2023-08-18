import { resolve } from 'path';
import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync, lstatSync } from 'node:fs';
import YAML from 'yaml';
import { env, util, logger } from 'lib';

function keys(proxy) {
    return Reflect.ownKeys(proxy);
}
/**
 * Create an iterator for the proxy.
 * @param {Proxy} proxy FileDB instance
 * @param {(key: string, value: any) => Boolean} filter
 * Filter function for the iterator. If defined, will only yield
 * entries that evaluates to truthy values.
 * @returns {IterableIterator<[key: string, value: any]>}
 */
function* iter(proxy, filter = undefined) {
    for (const key of keys(proxy)) {
        const value = proxy[key];
        if (filter && !filter(key, value)) continue;
        yield [key, value];
    }
}

function insert(proxy, n = 12) {
    let key;
    do {
        key = util.randomString(n);
    } while (key in proxy);
    return data => {
        if (data !== undefined) proxy[key] = data;
        return key;
    };
}

export default { keys, iter, insert };

class FileProxy {
    stringify(data) { return data }
    parse(data) { return data }
    /**
     * @param {string} path
     * @param {(name: string, raw: Buffer) => Any} handler
     */
    constructor(directory, self = this) {
        const path = file => resolve(directory, file);

        function has(self, file) {
            if (!existsSync(path(file))) return false;
            else return lstatSync(path(file)).isFile();
        }

        function ownKeys(self) {
            return readdirSync(directory).filter(f => has(self, f));
        }

        function get(self, file) {
            if (has({}, file)) {
                const data = readFileSync(path(file));
                return self.parse(data);
            } else {
                return undefined;
            }
        }

        function set(self, file, value) {
            // Validate filename
            if (typeof file !== 'string' || !file) {
                throw new TypeError(`Invalid type for filename: ${typeof file} (${file})`);
            }

            try {
                const data = self.stringify(value);
                writeFileSync(path(file), data);
                return true;
            } catch (e) {
                logger.error(e.stack);
                return false;
            }
        }

        function deleteProperty(self, file) {
            if (has(self, file)) {
                unlinkSync(path(file));
                return true;
            } else {
                return false;
            }
        }

        return new Proxy(self, { has, ownKeys, get, set, deleteProperty });
    }
}

class StudentDB {
    constructor() {
        return new FileProxy(env.path.students, this);
    }
    /**
     * @param {{name: string, meta: Object}} data
     * @returns {Buffer}
     */
    stringify(data) {
        const
            { name, meta } = data,
            content = [JSON.stringify(name), YAML.stringify(meta)];
        return Buffer.from(content.join('\n'));
    }
    /**
     * @param {Buffer} raw
     * @returns {{name: string, meta: Object}}
     */
    parse(raw) {
        const [name, ...yml] = raw.toString('utf-8').split('\n');
        return {
            name: JSON.parse(name),
            meta: YAML.parse(yml.join('\n'))
        };
    }
}
/**
 * @type {{[sid: string]: {name: string, meta: Object}}}
 */
export const students = new StudentDB;

class RequestDB {
    constructor() {
        return new FileProxy(env.path.requests, this);
    }
    /**
     * @param {{name: string, meta: Object}} data
     * @returns {Buffer}
     */
    stringify(data) {
        const content = YAML.stringify(data);
        return Buffer.from(content);
    }
    /**
     * @param {Buffer} raw
     * @returns {{name: string, meta: Object}}
     */
    parse(raw) {
        return YAML.parse(raw.toString('utf-8'));
    }
}
/**
 * @type {{[token: string]: {sid: string, flag: boolean, ...others}}}
 */
export const requests = new RequestDB;
