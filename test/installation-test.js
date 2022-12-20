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
const PackageJson  = require('@npmcli/package-json');

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
    const packageJsonContent = '{\n' + '  "name": "tests",\n' + '  "version": "1.0.0"\n' + '}\n';

    await fs.mkdir(PROJECT_FOLDER);
    await fs.writeFile(path.join(PROJECT_FOLDER, 'package.json'), packageJsonContent);
    await fs.writeFile(path.join(PROJECT_FOLDER, '.testcaferc.js'), '');
}

function cleanProjectFolder () {
    return fs.rmdir(PROJECT_FOLDER, { recursive: true });
}

async function getFiles (dir) {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = path.join(dir, dirent.name);

        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return files.flat();
}

describe('Installation', function () {
    this.timeout(10000);

    describe('Clean installation JS', () => {
        before(() => initProject({
            template:                   'javascript',
            silent:                     true,
            ['test-folder']:            'custom-test',
            ['run-npm-install']:        false,
            ['create-github-workflow']: true,
        }));

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'test.yml'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'examples', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'examples', 'test.js'),
                path.join(PROJECT_FOLDER, 'custom-test', 'first-test.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
            ];

            expect(files).deep.equal(expectedResult);
        });
    });


    describe('Clean installation TS', () => {
        this.timeout(20000);

        before(() => initProject({
            template:                   'typescript',
            silent:                     true,
            ['run-npm-install']:        false,
            ['create-github-workflow']: false,
        }));

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'examples', 'page-model.ts'),
                path.join(PROJECT_FOLDER, 'tests', 'examples', 'test.ts'),
                path.join(PROJECT_FOLDER, 'tests', 'first-test.ts'),
            ];

            expect(files).deep.equal(expectedResult);
        });
    });

    describe('Installation to the existing JS project', () => {
        before(async () => {
            await preinitProject();

            return initProject({
                template:                   'javascript',
                silent:                     true,
                ['test-folder']:            'tests',
                ['create-github-workflow']: true,
                ['run-npm-install']:        false,
            });
        });

        after(() => cleanProjectFolder());

        it('Project structure', async () => {
            const files = await getFiles(PROJECT_FOLDER);

            const expectedResult = [
                path.join(PROJECT_FOLDER, '.github', 'workflows', 'test.yml'),
                path.join(PROJECT_FOLDER, '.last.testcaferc.js'),
                path.join(PROJECT_FOLDER, '.testcaferc.js'),
                path.join(PROJECT_FOLDER, 'package.json'),
                path.join(PROJECT_FOLDER, 'tests', 'examples', 'page-model.js'),
                path.join(PROJECT_FOLDER, 'tests', 'examples', 'test.js'),
                path.join(PROJECT_FOLDER, 'tests', 'first-test.js'),
            ];

            expect(files).deep.equal(expectedResult);
        });

        it('Package JSON', async () => {
            const pkgJson = await PackageJson.load(PROJECT_FOLDER);

            expect(pkgJson.content.scripts.test).equal('testcafe --config-file .last.testcaferc.js');
            expect(pkgJson.content.devDependencies.testcafe).equal('*');
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
