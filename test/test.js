const {
    describe,
    it,
    before,
    after,
} = require('mocha');

const childProcess = require('child_process');
const fs           = require('fs');
const { expect }   = require('chai');

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
    return fs.rmSync(PROJECT_FOLDER, { recursive: true });
}


describe('Clean installation JS', function () {
    this.timeout(10000);

    before(() => initProject({
        template:            'javascript',
        silent:              true,
        ['test-folder']:     'custom-test',
        ['run-npm-install']: false,
    }));

    after(() => cleanProjectFolder());

    it('Project structure', () => {
        const files = fs.readdirSync(PROJECT_FOLDER);

        expect(files.length).eql(3);
    });
});


// describe('Clean installation TS', () => {
//     before(() => initProject({ template: 'typescript', silent: true }));
//
//     after(() => cleanProjectFolder());
//
//     it('Project structure', () => {
//         expect('test').eql('test');
//     });
// });
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
