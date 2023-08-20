import { resolve } from 'path';
import { readdirSync, readFileSync, writeFileSync, unlinkSync, existsSync, lstatSync } from 'node:fs';
import YAML from 'yaml';
import { env, util, logger } from 'lib';

export default class FileDB {
    // ---------------------------- static methods ----------------------------
    /**
     * Get own keys of a given FileDB instance.
     * @param {FileDB} db FileDB instance
     * @returns {string[]}
     */
    static keys(db) {
        return Reflect.ownKeys(db);
    }
    /**
     * Create an iterator for the proxy.
     * @param {FileDB} db FileDB instance
     * @param {(key: string, value: any) => Boolean} filter
     * Filter function for the iterator. If defined, will only yield
     * entries that evaluates to truthy values.
     * @returns {IterableIterator<[key: string, value: any]>}
     */
    static* iter(db, filter = undefined) {
        for (const key of this.keys(db)) {
            const value = db[key];
            if (filter && !filter(key, value)) continue;
            yield [key, value];
        }
    }
    /**
     * Insert a new entry into the database with a randomly generated key.
     * @param {FileDB} db FileDB instance
     * @param {number} randomKeyLength Length of the random key
     * @returns {string} Random key associated with the inserted entry
     */
    static insert(db, data, randomKeyLength = 12) {
        let key;
        do {
            key = util.randomString(randomKeyLength);
        } while (key in db);
        if (data !== undefined) {
            db[key] = data;
            return key;
        } else {
            return undefined;
        }
    }
    // --------------------------- abstract methods ---------------------------
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
            // Validate value
            if (value === undefined) {
                if (has(self, file)) {
                    deleteProperty(self, file);
                }
                return true;
            }
            // Insert value
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
    constructor(directory) {
        return new FileDB(directory, this);
    }
    /**
     * @param {{name: string, meta: Object}} data
     * @returns {Buffer}
     */
    stringify(data) {
        if (data === undefined) return undefined;
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
export const student = new StudentDB(env.path.students);

class RecordDB {
    constructor(directory) {
        return new FileDB(directory, this);
    }
    /**
     * @param {{name: string, meta: Object}} data
     * @returns {Buffer}
     */
    stringify(data) {
        if (data === undefined) return undefined;
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
export const record = new RecordDB(env.path.records);
