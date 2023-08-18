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
const csv = CSV();
stdin.pipe(csv);
// Use the readable stream api to consume records
let header;
csv.on('readable', () => {
    if (!header) {
        header = csv.read();
        if (!header.includes(primary_name)) {
            throw new Error(`Primary key" ${primary_name}" not found in header ${header}}`);
        }
    }
    const hashPool = [];
    let line;
    while ((line = csv.read()) !== null) {
        const
            // Hash all values to make the primary key
            hash = crypto
                .createHash('md5')
                .update(line.join(' '))
                .digest('hex')
                .slice(0, 8),
            // Construct the record
            { [primary_name]: name, ...record } = Object.fromEntries(
                header.map((key, index) => [key, line[index]])
            ),
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
