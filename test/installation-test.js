const {
    describe,
    it,
    before,
    after,
} = require('mocha');

const fs = require('fs/promises');

const childProcess = require('child_process');
const { expect }   = require('chai');
const path         = require('path');

const PROJECT_FOLDER = 'tmp_test_project';

function initProject (args) {
    const argsString = Object.entries(args)
        .map(([key, value]) => `--${ key } ${ value }`)
        .join(' ');

    return childProcess.spawnSync(`npm init testcafe ${ PROJECT_FOLDER } -- ${ argsString }`, {
        stdio: 'inherit',
        shell: true,
    });
}

async function preinitProject () {
    const packageJsonContent = '{\n' +
                               '  "name": "data",\n' +
                               '  "version": "1.0.0",\n' +
                               '  "scripts": {\n' +
                               '    "test": "echo"\n' +
                               '  }\n' +
                               '}';

    await fs.mkdir(PROJECT_FOLDER);
    await fs.writeFile(path.join(PROJECT_FOLDER, 'package.json'), packageJsonContent);
    await fs.writeFile(path.join(PROJECT_FOLDER, '.testcaferc.js'), '');
}

function cleanProjectFolder () {
    return fs.rmdir(PROJECT_FOLDER, { recursive: true });
}

const EXCLUDE_PATTERNS = [
    /.*[/\\]node_modules[/\\].*/,
    /.*[/\\]package-lock.json/,
];

async function getFiles (dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dir, dirent.name);

        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return files.flat().filter(f => !EXCLUDE_PATTERNS.some(pattern => pattern.test(f)));
}

describe('Installation', function () {
    this.timeout(30000);

    describe('Clean installation JS', () => {
        before(() => initProject({
            template:                   'javascript',
            ['test-folder']:            'custom-test',
            ['run-npm-install']:        false,
            ['create-github-workflow']: true,
        }));

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);


            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'test.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
            ];

            expect(files).deep.equal(expectedResult);
        });
    });


    describe('Clean installation TS', () => {
        before(() => initProject({
            template:                   'typescript',
            ['run-npm-install']:        false,
            ['create-github-workflow']: false,
        }));

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'page-model.ts'),
                path.join(PROJECT_FOLDER, 'tests', 'test.ts'),
            ];

            expect(files).deep.equal(expectedResult);
        });
    });

    describe('Installation to the existing JS project', () => {
        before(async () => {
            await preinitProject();

            return initProject({
                template:                   'javascript',
                ['test-folder']:            'tests',
                ['create-github-workflow']: true,
                ['run-npm-install']:        false,
                ['run-wizard']:             false,
            });
        });

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'tests', 'test.js'),
            ];

            expect(files).deep.equal(expectedResult);
        });

        it('Package JSON', async () => {
            const pkgJsonString = await fs.readFile(path.join(PROJECT_FOLDER, 'package.json'), { encoding: 'utf-8' });
            const pkgJson       = JSON.parse(pkgJsonString);

            expect(pkgJson?.devDependencies?.testcafe).to.not.equal(null);
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
