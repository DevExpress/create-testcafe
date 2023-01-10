const {
    describe,
    it,
    expect,
    beforeAll,
}            = require('@jest/globals');
const {
    run,
    TEMP_DIR_PATH,
    getTestFilesPaths,
    getPackageLockName,
    GITHUB_WORKFLOW_PATH,
    TC_CONFIG_NAME,
    PACKAGE_JSON_NAME,
}            = require('./utils');
const { execSync } = require('child_process');

const PACKAGE_MANAGERS = [
    'npm',
    'yarn',
    'pnpm',
];

// eslint-disable-next-line no-undef
jest.setTimeout(1000 * 60);
describe('Installation test', function () {
    beforeAll(() => {
        execSync('npm i -g yarn');
        execSync('npm i -g pnpm');
    });

    for (const packageManager of PACKAGE_MANAGERS) {

        it('Installation to empty project without params', async () => {
            const { exitCode, stdout, files, error } = await run(packageManager);

            if (error)
                throw error;

            const expectedStdOut = `Initializing a new TestCafé project at '${ TEMP_DIR_PATH }'. Selected settings:
   Template: javascript (default)
   Test location: tests (default)
   Populate the project with sample tests: Yes (default)
   Create a GitHub Actions workflow: Yes (default)
Copying file templates...
Generating a configuration file...
Installing dependencies...\n
Success! Created a TestCafé project at '${ TEMP_DIR_PATH }'\n
Execute the following command to run tests: npx testcafe chrome\n
`;

            const expectedFiles = [
                GITHUB_WORKFLOW_PATH,
                TC_CONFIG_NAME,
                getPackageLockName(packageManager),
                PACKAGE_JSON_NAME,
                ...getTestFilesPaths('tests'),
            ];

            expectedFiles.sort();

            expect(exitCode).toEqual(0);
            expect(stdout).toStrictEqual(expectedStdOut);
            expect(files).toEqual(expectedFiles);
        });

        // describe('Clean installation JS', () => {
        //     beforeAll(() => {
        //         initProject({
        //             template:                   'javascript',
        //             ['test-folder']:            'custom-test',
        //             ['create-github-workflow']: true,
        //         });
        //     });
        //
        //     it('Project structure', async () => {
        //         const files = await getFiles(PROJECT_FOLDER);
        //
        //
        //         const expectedResult = [
        //             path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
        //             path.join(PROJECT_FOLDER, '.testcaferc.js'),
        //             path.join(PROJECT_FOLDER, 'custom-test', 'page-model.js'),
        //             path.join(PROJECT_FOLDER, 'custom-test', 'test.js'),
        //             path.join(PROJECT_FOLDER, 'package.json'),
        //         ];
        //
        //         expect(files).toEqual(expectedResult);
        //     });
        // });
        //
        //
        // describe('Clean installation TS', () => {
        //     beforeAll(() => {
        //         initProject({
        //             template:                   'typescript',
        //             ['create-github-workflow']: false,
        //         });
        //     });
        //
        //     it('Project structure', async () => {
        //         const files = await getFiles(PROJECT_FOLDER);
        //
        //         const expectedResult = [
        //             path.join(PROJECT_FOLDER, '.testcaferc.js'),
        //             path.join(PROJECT_FOLDER, 'package.json'),
        //             path.join(PROJECT_FOLDER, 'tests', 'page-model.ts'),
        //             path.join(PROJECT_FOLDER, 'tests', 'test.ts'),
        //         ];
        //
        //         expect(files).toEqual(expectedResult);
        //     });
        // });
        //
        // describe('Installation to the existing JS project', () => {
        //     beforeAll(() => {
        //         preinitProject();
        //
        //         initProject({
        //             template:                   'javascript',
        //             ['test-folder']:            'tests',
        //             ['create-github-workflow']: true,
        //             ['run-wizard']:             false,
        //         });
        //     });
        //
        //     it('Project structure', async () => {
        //         const files = await getFiles(PROJECT_FOLDER);
        //
        //         const expectedResult = [
        //             path.join(PROJECT_FOLDER, '.github', 'workflows', 'testcafe.yml'),
        //             path.join(PROJECT_FOLDER, '.testcaferc.js'),
        //             path.join(PROJECT_FOLDER, 'package.json'),
        //             path.join(PROJECT_FOLDER, 'tests', 'page-model.js'),
        //             path.join(PROJECT_FOLDER, 'tests', 'test.js'),
        //         ];
        //
        //         expect(files).toEqual(expectedResult);
        //     });
        //
        //     it('Package JSON', () => {
        //         const pkgJsonString = fs.readFileSync(path.join(PROJECT_FOLDER, 'package.json'), { encoding: 'utf-8' });
        //         const pkgJson       = JSON.parse(pkgJsonString);
        //
        //         expect(pkgJson?.devDependencies?.testcafe).toBeDefined();
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
    }
});
