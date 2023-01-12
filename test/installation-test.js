const {
    describe,
    it,
    expect,
    afterEach,
    jest: jestLib,
}                         = require('@jest/globals');
const OS                        = require('os-family');
const path                      = require('path');
const { generateConfigContent } = require('../dist/template-generator/testcafe-config');

const {
    run,
    TEMP_DIR_PATH,
    getTestFilesPaths,
    getPackageLockName,
    GITHUB_WORKFLOW_PATH,
    TC_CONFIG_NAME,
    PACKAGE_JSON_NAME,
    removeTempDirs,
    addExistingProjectFiles,
    ABSOLUTE_TEMP_DIR_NAME,
} = require('./utils');

const PACKAGE_MANAGERS = [
    'npm',
    'yarn',
    'pnpm',
];

jestLib.setTimeout(1000 * 120);

describe('Installation test', function () {
    afterEach(() => removeTempDirs());

    for (const packageManager of PACKAGE_MANAGERS) {

        it(`Installation to empty project. PM: ${ packageManager }. Template: javascript`, async () => {
            const template = 'javascript';
            const {
                exitCode,
                stdout,
                files,
                error,
                packageJsonContent,
                tcConfigContent,
            } = await run(packageManager, '', { template });

            if (error)
                throw error;

            const browser = OS.mac ? 'safari' : 'chrome';

            const expectedStdOut = `\nInitializing a new TestCafé project at '${ TEMP_DIR_PATH }'. Selected settings:\n`
                                       + `   Template: ${ template } (you selected this)\n`
                                       + `   Test location: tests (default)\n`
                                       + `   Populate the project with sample tests: Yes (default)\n`
                                       + `   Create a GitHub Actions workflow: Yes (default)\n`
                                       + `Copying file templates...\n`
                                       + `Generating a GitHub Actions workflow...\n`
                                       + `Generating a configuration file...\n`
                                       + `Installing dependencies...\n\n`
                                       + `Success! Created a TestCafé project at '${ TEMP_DIR_PATH }'\n\n`
                                       + `Execute the following command to run tests: npx testcafe ${ browser }\n\n`;

            const expectedFiles = [
                GITHUB_WORKFLOW_PATH,
                TC_CONFIG_NAME,
                getPackageLockName(packageManager),
                PACKAGE_JSON_NAME,
                ...getTestFilesPaths('tests', template),
            ];

            expectedFiles.sort();

            expect(exitCode).toEqual(0);
            expect(stdout).toStrictEqual(expectedStdOut);
            expect(files).toEqual(expectedFiles);
            expect(packageJsonContent?.devDependencies?.testcafe).toBeDefined();
            expect(tcConfigContent).toEqual(generateConfigContent({ src: 'tests' }));
        });

        it(`Installation to existing project. PM: ${ packageManager }. Template: typescript`, async () => {
            addExistingProjectFiles('', ['.testcaferc.js']);

            const template = 'typescript';
            const { exitCode, stdout, files, error, packageJsonContent, tcConfigContent } = await run(packageManager, '', {
                template,
                'run-wizard': false,
            });

            if (error)
                throw error;

            const browser = OS.mac ? 'safari' : 'chrome';

            const expectedStdOut = `\nInitializing a new TestCafé project at '${ TEMP_DIR_PATH }'. Selected settings:\n`
                                       + `   Template: ${ template } (you selected this)\n`
                                       + `   Test location: tests (default)\n`
                                       + `   Populate the project with sample tests: Yes (default)\n`
                                       + `   Create a GitHub Actions workflow: Yes (default)\n`
                                       + `Copying file templates...\n`
                                       + `Generating a GitHub Actions workflow...\n`
                                       + `Adding TestCafe to project dependencies...\n\n`
                                       + `Success! Created a TestCafé project at '${ TEMP_DIR_PATH }'\n\n`
                                       + `Execute the following command to run tests: npx testcafe ${ browser } "tests"\n\n`;

            const expectedFiles = [
                GITHUB_WORKFLOW_PATH,
                TC_CONFIG_NAME,
                getPackageLockName(packageManager),
                PACKAGE_JSON_NAME,
                ...getTestFilesPaths('tests', template),
            ];

            expectedFiles.sort();

            expect(exitCode).toEqual(0);
            expect(stdout).toStrictEqual(expectedStdOut);
            expect(files).toEqual(expectedFiles);
            expect(packageJsonContent?.devDependencies?.testcafe).toBeDefined();
            expect(tcConfigContent).toEqual('');
        });

    }

    it(`Installation to empty project with arguments: relative <appName> , installGHActions = false , testFolder = custom, template = typescript`, async () => {
        const packageManager = 'npm';
        const template       = 'typescript';
        const appName        = 'myApp';
        const testFolder     = 'custom';
        const appPath        = path.join(TEMP_DIR_PATH, appName);

        const { exitCode, stdout, files, error, packageJsonContent, tcConfigContent } = await run(packageManager, appName, {
            template,
            'test-folder':        testFolder,
            'add-github-actions': false,
        });

        if (error)
            throw error;

        const browser = OS.mac ? 'safari' : 'chrome';

        const expectedStdOut = `\nInitializing a new TestCafé project at '${ appPath }'. Selected settings:\n`
                               + `   Template: ${ template } (you selected this)\n`
                               + `   Test location: ${ testFolder } (you selected this)\n`
                               + `   Populate the project with sample tests: Yes (default)\n`
                               + `   Create a GitHub Actions workflow: No (you selected this)\n`
                               + `Copying file templates...\n`
                               + `Generating a configuration file...\n`
                               + `Installing dependencies...\n\n`
                               + `Success! Created a TestCafé project at '${ appPath }'\n\n`
                               + `Go to the project directory to run your first test: cd ${ appName }\n\n`
                               + `Execute the following command to run tests: npx testcafe ${ browser }\n\n`;

        const expectedFiles = [
            path.join(appName, TC_CONFIG_NAME),
            path.join(appName, getPackageLockName(packageManager)),
            path.join(appName, PACKAGE_JSON_NAME),
            ...getTestFilesPaths(path.join(appName, testFolder), template),
        ];

        expectedFiles.sort();

        expect(exitCode).toEqual(0);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(files).toEqual(expectedFiles);
        expect(packageJsonContent?.devDependencies?.testcafe).toBeDefined();
        expect(tcConfigContent).toEqual(generateConfigContent({ src: testFolder }));
    });

    it(`Installation to empty project with arguments: absolute <appName> , testFolder = custom, template = typescript`, async () => {
        const packageManager = 'npm';
        const template       = 'typescript';
        const appName        = 'my-app';
        const appPath        = path.join(process.cwd(), ABSOLUTE_TEMP_DIR_NAME, appName);
        const testFolder     = 'custom';

        const { exitCode, stdout, files, error, packageJsonContent, tcConfigContent } = await run(packageManager, appPath, {
            template,
            'test-folder': testFolder,
        });

        if (error)
            throw error;

        const browser = OS.mac ? 'safari' : 'chrome';

        const expectedStdOut = `\nInitializing a new TestCafé project at '${ appPath }'. Selected settings:\n`
                               + `   Template: ${ template } (you selected this)\n`
                               + `   Test location: ${ testFolder } (you selected this)\n`
                               + `   Populate the project with sample tests: Yes (default)\n`
                               + `   Create a GitHub Actions workflow: Yes (default)\n`
                               + `Copying file templates...\n`
                               + `Generating a GitHub Actions workflow...\n`
                               + `Generating a configuration file...\n`
                               + `Installing dependencies...\n\n`
                               + `Success! Created a TestCafé project at '${ appPath }'\n\n`
                               + `Go to the project directory to run your first test: cd ${ path.relative(TEMP_DIR_PATH, appPath) }\n\n`
                               + `Execute the following command to run tests: npx testcafe ${ browser }\n\n`;

        const expectedFiles = [
            path.join(appName, GITHUB_WORKFLOW_PATH),
            path.join(appName, TC_CONFIG_NAME),
            path.join(appName, getPackageLockName(packageManager)),
            path.join(appName, PACKAGE_JSON_NAME),
            ...getTestFilesPaths(path.join(appName, testFolder), template),
        ];

        expectedFiles.sort();

        expect(exitCode).toEqual(0);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(files).toEqual(expectedFiles);
        expect(packageJsonContent?.devDependencies?.testcafe).toBeDefined();
        expect(tcConfigContent).toEqual(generateConfigContent({ src: testFolder }));
    });
});
