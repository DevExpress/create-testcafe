const path      = require('path');
const { spawn } = require('child_process');
const fs        = require('fs');
const OS        = require('os-family');

const EXCLUDE_PATTERNS = [
    /.*[/\\]node_modules[/\\].*/,
];

const TEMP_DIR_NAME        = 'tmp_test_project';
const TEMP_DIR_PATH        = path.join(process.cwd(), TEMP_DIR_NAME);
const GITHUB_WORKFLOW_PATH = path.join('.github', 'workflows', 'testcafe.yml');
const TC_CONFIG_NAME       = '.testcaferc.js';
const PACKAGE_JSON_NAME    = 'package.json';

const getTestFilesPaths = (testFolderName) => [
    path.join(testFolderName, 'page-model.js'),
    path.join(testFolderName, 'test.js'),
];

function spawnAsync (cmd, options) {
    const p = spawn(cmd, options);

    return new Promise(resolve => {
        let stdout = '';
        let stderr = '';

        p.stdout.on('data', chunk => process.stdout.write(chunk));
        p.stderr.on('data', chunk => process.stderr.write(chunk));

        if (p.stdout) {
            p.stdout.on('data', data => {
                stdout += data;
            });
        }
        if (p.stderr) {
            p.stderr.on('data', data => {
                stderr += data;
            });
        }

        p.on('close', code => resolve({ stdout, stderr, code }));
        p.on('error', error => resolve({ stdout, stderr, code: 0, error }));
    });
}

async function run (packageManager, appName = '', options = {}) {
    if (fs.existsSync(TEMP_DIR_PATH))
        fs.rmdirSync(TEMP_DIR_PATH, { recursive: true });

    fs.mkdirSync(TEMP_DIR_PATH, { recursive: true });
    // eslint-disable-next-line no-nested-ternary
    const userAgent = packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm/0.0.0' : void 0;

    const argsString = Object.entries(options)
        .map(([key, value]) => `--${ key } ${ value }`)
        .join(' ');

    const cmdExecutor = OS.win ? 'node' : 'nodejs';

    const command = [
        cmdExecutor,
        path.join(__dirname, '..'),
        appName,
        argsString,
    ]
        .filter(arg => !!arg)
        .join(' ');

    const result = await spawnAsync(command, {
        shell: true,
        cwd:   TEMP_DIR_PATH,
        env:   {
            'npm_config_user_agent': userAgent,
        },
    });

    const files = (await getFiles(TEMP_DIR_PATH)).map(f => path.relative(TEMP_DIR_PATH, f));

    files.sort();

    return {
        exitCode: result.code,
        stdout:   result.stdout,
        files,
    };
}

function getPackageLockName (packageManager) {
    if (packageManager === 'pnpm')
        return 'pnpm-lock.yaml';
    if (packageManager === 'yarn')
        return 'yarn.lock';

    return 'package-lock.json';
}

async function getFiles (dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dir, dirent.name);

        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return files.flat().filter(f => !EXCLUDE_PATTERNS.some(pattern => pattern.test(f)));
}

// function preinitProject () {
//     const packageJsonContent = '{\n' +
//                                '  "name": "data",\n' +
//                                '  "version": "1.0.0",\n' +
//                                '  "scripts": {\n' +
//                                '    "test": "echo"\n' +
//                                '  }\n' +
//                                '}';
//
//     fs.mkdirSync(PROJECT_FOLDER);
//     fs.writeFileSync(path.join(PROJECT_FOLDER, 'package.json'), packageJsonContent);
//     fs.writeFileSync(path.join(PROJECT_FOLDER, '.testcaferc.js'), '');
// }


module.exports = {
    run,
    getTestFilesPaths,
    getPackageLockName,
    spawnAsync,
    TEMP_DIR_PATH,
    GITHUB_WORKFLOW_PATH,
    TC_CONFIG_NAME,
    PACKAGE_JSON_NAME,
};
