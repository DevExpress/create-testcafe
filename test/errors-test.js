const {
    describe,
    it,
    expect,
    afterEach,
}          = require('@jest/globals');
const path = require('path');

const {
    run,
    TEMP_DIR_PATH,
    addExistingProjectFiles,
    removeTempDirs,
} = require('./utils');


describe('Errors test', function () {
    afterEach(() => removeTempDirs());

    it(`Should throw error if testFolder already contains files`, async () => {
        const packageManager = 'npm';
        const testFolderName = 'custom';
        const testFolderPath = path.join(TEMP_DIR_PATH, testFolderName);

        addExistingProjectFiles('', [path.join(testFolderName, 'test.js')]);

        const { exitCode, stdout, error, packageJsonContent, tcConfigContent } = await run(packageManager, '', {
            'test-folder': testFolderName,
            'run-wizard':  false,
        });

        if (error)
            throw error;

        const expectedStdOut = 'An error occurred during the installation process:\n' +
                               `The ${ testFolderPath } folder is not empty.\n`;

        expect(exitCode).toEqual(1);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(packageJsonContent?.devDependencies?.testcafe).not.toBeDefined();
        expect(tcConfigContent).toEqual(null);
    });

    it(`Should throw error if testFolder path is not a folder`, async () => {
        const packageManager = 'npm';
        const testFolderName = 'custom';
        const testFolderPath = path.join(TEMP_DIR_PATH, testFolderName);

        addExistingProjectFiles('', [testFolderName]);

        const { exitCode, stdout, error, packageJsonContent, tcConfigContent } = await run(packageManager, '', {
            'test-folder': testFolderName,
            'run-wizard':  false,
        });

        if (error)
            throw error;

        const expectedStdOut = 'An error occurred during the installation process:\n' +
                               `The ${ testFolderPath } path points to a file. Specify a different test folder path.\n`;

        expect(exitCode).toEqual(1);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(packageJsonContent?.devDependencies?.testcafe).not.toBeDefined();
        expect(tcConfigContent).toEqual(null);
    });

    it(`Should throw error if testFolder path is not valid`, async () => {
        const packageManager = 'npm';
        const testFolderName = '""';

        const { exitCode, stdout, error, packageJsonContent, tcConfigContent } = await run(packageManager, '', {
            'test-folder': testFolderName,
            'run-wizard':  false,
        });

        if (error)
            throw error;

        const expectedStdOut = 'An error occurred during the installation process:\n' +
                               'Invalid test folder path: ""\n';

        expect(exitCode).toEqual(1);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(packageJsonContent?.devDependencies?.testcafe).not.toBeDefined();
        expect(tcConfigContent).toEqual(null);
    });

    it(`Should throw error if invalid arguments provided`, async () => {
        const packageManager = 'npm';

        const { exitCode, stdout, error, packageJsonContent, tcConfigContent } = await run(packageManager, '', {
            'invalid-arg': 'someValue',
        });

        if (error)
            throw error;

        const expectedStdOut = 'An error occurred during the installation process:\n' +
                               'Unknown arguments: invalid-arg, invalidArg\n';

        expect(exitCode).toEqual(1);
        expect(stdout).toStrictEqual(expectedStdOut);
        expect(packageJsonContent?.devDependencies?.testcafe).not.toBeDefined();
        expect(tcConfigContent).toEqual(null);
    });
});
