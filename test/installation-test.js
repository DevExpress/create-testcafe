const { describe, expect, it, afterAll, beforeAll } = require('@jest/globals');

const fs = require('fs');

const childProcess = require('child_process');
const path         = require('path');

const PROJECT_FOLDER = 'tmp_test_project';

function initProject (args) {
    const argsString = Object.entries(args)
        .map(([key, value]) => `--${ key } ${ value }`)
        .join(' ');

    console.log(`Running: npm init testcafe ${ PROJECT_FOLDER } -- ${ argsString }`);

    return childProcess.spawnSync(`npm init testcafe ${ PROJECT_FOLDER } -- ${ argsString }`, {
        stdio: 'inherit',
        shell: true,
    });
}

function preinitProject () {
    const packageJsonContent = '{\n' +
                               '  "name": "data",\n' +
                               '  "version": "1.0.0",\n' +
                               '  "scripts": {\n' +
                               '    "test": "echo"\n' +
                               '  }\n' +
                               '}';

    fs.mkdirSync(PROJECT_FOLDER);
    fs.writeFileSync(path.join(PROJECT_FOLDER, 'package.json'), packageJsonContent);
    fs.writeFileSync(path.join(PROJECT_FOLDER, '.testcaferc.js'), '');
}

function cleanProjectFolder () {
    return fs.rmdirSync(PROJECT_FOLDER, { recursive: true });
}

const EXCLUDE_PATTERNS = [
    /.*[/\\]node_modules[/\\].*/,
    /.*package-lock.json/,
];

async function getFiles (dir) {
    const dirents = await fs.promises.readdir(dir, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dir, dirent.name);

        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return files.flat().filter(f => !EXCLUDE_PATTERNS.some(pattern => pattern.test(f)));
}

describe('Installation', function () {

    describe.only('Clean installation JS', () => {
        beforeAll(() => {
            initProject({
                template:                   'javascript',
                ['test-folder']:            'custom-test',
                ['create-github-workflow']: true,
            });
        });

        afterAll(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);


            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'test.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
            ];

            expect(files).toEqual(expectedResult);
        });
    });


    describe('Clean installation TS', () => {
        beforeAll(() => {
            initProject({
                template:                   'typescript',
                ['create-github-workflow']: false,
            });
        });

        afterAll(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'page-model.ts'),
                path.join(PROJECT_FOLDER, 'tests', 'test.ts'),
            ];

            expect(files).toEqual(expectedResult);
        });
    });

    describe('Installation to the existing JS project', () => {
        beforeAll(() => {
            preinitProject();

            initProject({
                template:                   'javascript',
                ['test-folder']:            'tests',
                ['create-github-workflow']: true,
                ['run-wizard']:             false,
            });
        });

        afterAll(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'tests', 'test.js'),
            ];

            expect(files).toEqual(expectedResult);
        });

        it('Package JSON', () => {
            const pkgJsonString = fs.readFileSync(path.join(PROJECT_FOLDER, 'package.json'), { encoding: 'utf-8' });
            const pkgJson       = JSON.parse(pkgJsonString);

            expect(pkgJson?.devDependencies?.testcafe).toBeDefined();
        });
    });
//
// describe('Installation to the existing TS project', () => {
//     before(() => initProject());
//
//     after(() => cleanProjectFolder());
//
//     it('Project structure', () => {
//         expect('test').eql('test');
//     });
// });
});
