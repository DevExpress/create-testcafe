const {
    describe,
    it,
    before,
    after,
} = require('mocha');

const childProcess       = require('child_process');
const { expect }         = require('chai');
const { readdir, rmdir } = require('fs/promises');
const { join }           = require('path');

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

function cleanProjectFolder () {
    return rmdir(PROJECT_FOLDER, { recursive: true });
}

async function getFiles (dir) {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files   = await Promise.all(dirents.map((dirent) => {
        const res = join(dir, dirent.name);

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
                join('tmp_test_project', '.github', 'workflows', 'test.yml'),
                join('tmp_test_project', '.testcaferc.js'),
                join('tmp_test_project', 'custom-test', 'examples', 'page-model.js'),
                join('tmp_test_project', 'custom-test', 'examples', 'test.js'),
                join('tmp_test_project', 'custom-test', 'first-test.js'),
                join('tmp_test_project', 'package.json'),
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
                join('tmp_test_project', '.testcaferc.js'),
                join('tmp_test_project', 'package.json'),
                join('tmp_test_project', 'tests', 'examples', 'page-model.ts'),
                join('tmp_test_project', 'tests', 'examples', 'test.ts'),
                join('tmp_test_project', 'tests', 'first-test.ts'),
            ];

            expect(files).deep.equal(expectedResult);
        });
    });
//
// describe('Installation to the existing JS project', () => {
//     before(() => initProject());
//
//     after(() => cleanProjectFolder());
//
//     it('Project structure', () => {
//         expect('test').eql('test');
//     });
// });
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
