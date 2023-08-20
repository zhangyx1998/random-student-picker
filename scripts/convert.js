import { stdin, stdout } from 'node:process';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import crypto from 'crypto';
import { ArgumentParser } from 'argparse';
import { parse as CSV } from 'csv-parse';
import YAML from 'yaml';
// Argument parsing
const parser = new ArgumentParser({
    description: 'Student List Conversion Utility'
});
parser.add_argument(
    '-N', '--primary-name',
    { help: 'Primary Name', default: 'Student' }
);
parser.add_argument(
    '-O', '--out-dir',
    { help: 'Optional Output Dir' }
);
parser.add_argument(
    '-f', '--force',
    { help: 'Force overwrite existing files', default: false, action: 'store_true' }
);

const
    args = parser.parse_args(),
    { primary_name, out_dir, force } = args;
if (out_dir) {
    await mkdir(out_dir, { recursive: true });
}
// Process CSV from stdin
const csv = CSV({ columns: true, skip_empty_lines: true, trim: true });
stdin.pipe(csv);
// Use the readable stream api to consume records
csv.on('readable', () => {
    const hashPool = [];
    /* eslint-disable no-constant-condition */
    while (true) {
        const line = csv.read();
        if (!line) break;
        const
            // Hash all values to make the primary key
            hash = crypto
                .createHash('md5')
                .update(JSON.stringify(line, Object.keys(line).sort()))
                .digest('hex')
                .slice(0, 8)
                .toUpperCase(),
            // Construct the record
            { [primary_name]: name, ...record } = line,
            // Format for output
            output = JSON.stringify([name, record]);
        // Warn upon hash collision
        if (hashPool.includes(hash)) {
            console.error(`Duplicate hash ${hash} for ${output}`);
        }
        hashPool.push(hash);
        // Write to file if specified
        if (out_dir) {
            const
                out_path = `${out_dir}/${hash}`,
                content = [JSON.stringify(name), YAML.stringify(record)].join('\n');
            if (!force && existsSync(out_path)) {
                const existing = readFileSync(out_path, 'utf-8').toString();
                if (existing.trimEnd() !== content.trimEnd()) {
                    console.error(`File collision: ${hash}`);
                    console.error('\n===== Existing Content =====\n', existing);
                    console.error('\n=====   New  Content   =====\n', content);
                }
            } else {
                writeFileSync(out_path, content);
            }
        } else {
            // Output the record to stdout
            stdout.write(`${hash} ${output.slice(1, output.length - 1)}\n`);
        }
    }
});
