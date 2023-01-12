const path           = require('path');
const { spawn }      = require('child_process');
const fs             = require('fs');
const { pathExists } = require('../dist/utils');

const EXCLUDE_PATTERNS = [
    /.*[/\\]node_modules[/\\].*/,
];

const TEMP_DIR_NAME          = 'tmp_test_project';
const TEMP_DIR_PATH          = path.join(process.cwd(), TEMP_DIR_NAME);
const ABSOLUTE_TEMP_DIR_NAME = 'tmp_test_project_1';
const ABSOLUTE_TEMP_DIR_PATH = path.join(process.cwd(), ABSOLUTE_TEMP_DIR_NAME);
const GITHUB_WORKFLOW_PATH   = path.join('.github', 'workflows', 'testcafe.yml');
const TC_CONFIG_NAME         = '.testcaferc.js';
const PACKAGE_JSON_NAME      = 'package.json';

const getTestFilesPaths = (testFolderName, template = 'javascript') => [
    path.join(testFolderName, `page-model.${ template === 'javascript' ? 'js' : 'ts' }`),
    path.join(testFolderName, `test.${ template === 'javascript' ? 'js' : 'ts' }`),
];

function spawnAsync (cmd, options) {
    const p = spawn(cmd, options);

    return new Promise(resolve => {
        let stdout = '';
        let stderr = '';

        p.stdout.on('data', chunk => process.stdout.write(chunk));
        p.stderr.on('data', chunk => process.stderr.write(chunk));

        p.stdout.on('data', data => {
            stdout += data;
        });
        p.stderr.on('data', data => {
            stderr += data;
        });

        p.on('close', code => resolve({ stdout, stderr, code }));
        p.on('error', error => resolve({ stdout, stderr, code: 0, error }));
    });
}

function removeTempDirs () {
    if (fs.existsSync(TEMP_DIR_PATH))
        fs.rmdirSync(TEMP_DIR_PATH, { recursive: true });
    if (fs.existsSync(ABSOLUTE_TEMP_DIR_PATH))
        fs.rmdirSync(ABSOLUTE_TEMP_DIR_PATH, { recursive: true });
}

async function run (packageManager, appName = '', options = {}) {
    fs.mkdirSync(TEMP_DIR_PATH, { recursive: true });
    // eslint-disable-next-line no-nested-ternary
    const userAgent = packageManager === 'yarn' ? 'yarn' : packageManager === 'pnpm' ? 'pnpm/0.0.0' : void 0;

    const argsString = Object.entries(options)
        .map(([key, value]) => `--${ key } ${ value }`)
        .join(' ');

    const command = [
        'node',
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
            ...process.env,
            'npm_config_user_agent': userAgent,
        },
    });

    const filesDir = path.isAbsolute(appName) ? path.join(appName, '..') : TEMP_DIR_PATH;
    const appPath  = path.isAbsolute(appName) ? appName : path.join(filesDir, appName);

    const packageJsonPath = path.join(appPath, 'package.json');
    const tcConfigPath    = path.join(appPath, '.testcaferc.js');

    const packageJsonContent = await pathExists(packageJsonPath) ? await fs.promises.readFile(packageJsonPath, 'utf-8') : null;
    const tcConfigContent    = await pathExists(tcConfigPath) ? await fs.promises.readFile(tcConfigPath, 'utf-8') : null;
    const files              = (await getFiles(filesDir)).map(f => path.relative(filesDir, f));

    files.sort();

    return {
        exitCode:           result.code,
        stdout:             result.stdout,
        files,
        packageJsonContent: packageJsonContent ? JSON.parse(packageJsonContent) : null,
        tcConfigContent,
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

function addExistingProjectFiles (appName = '', extraFiles = []) {
    const distPath           = path.join(TEMP_DIR_PATH, appName);
    const packageJsonContent = '{\n' +
                               '  "name": "data",\n' +
                               '  "version": "1.0.0",\n' +
                               '  "scripts": {\n' +
                               '    "test": "echo"\n' +
                               '  }\n' +
                               '}';

    fs.mkdirSync(distPath);
    fs.writeFileSync(path.join(distPath, 'package.json'), packageJsonContent);

    for (const extraFile of extraFiles) {
        const filePath = path.join(distPath, extraFile);
        const dirName  = path.dirname(filePath);

        if (!fs.existsSync(dirName))
            fs.mkdirSync(dirName, { recursive: true });

        fs.writeFileSync(filePath, '');
    }
}

// const concat         = require('concat-stream');
// async function runWizard (commands) {
//     const proc = spawn('node', [path.join(__dirname, '..')], {
//         stdio: [null, null, null],
//         cwd:   TEMP_DIR_PATH,
//     });
//
//     proc.stdin.setEncoding('utf-8');
//
//     const wait         = ms => new Promise(resolve => setTimeout(resolve, ms));
//     const writeCommand = cmd => proc.stdin.write(cmd);
//
//     for (const cmd of commands) {
//         writeCommand(cmd);
//         await wait(200);
//     }
//
//     proc.stdin.end();
//
//     return new Promise(function (resolve) {
//         proc.stdout.pipe(concat(function (result) {
//             resolve(result.toString());
//         }));
//     });
// }
// module.exports.DOWN  = '\x1B\x5B\x42';
// module.exports.UP    = '\x1B\x5B\x41';
// module.exports.ENTER = '\x0D';

module.exports = {
    run,
    getTestFilesPaths,
    getPackageLockName,
    removeTempDirs,
    addExistingProjectFiles,
    TEMP_DIR_NAME,
    TEMP_DIR_PATH,
    GITHUB_WORKFLOW_PATH,
    TC_CONFIG_NAME,
    PACKAGE_JSON_NAME,
    ABSOLUTE_TEMP_DIR_PATH,
    ABSOLUTE_TEMP_DIR_NAME,
};
