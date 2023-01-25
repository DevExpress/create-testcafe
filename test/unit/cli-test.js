const {
    describe,
    it,
    expect,
}              = require('@jest/globals');
const path           = require('path');
const { spawnAsync } = require('../utils');
const InitOptions    = require('../../dist/options/init-options').default;
const setCliOptions  = require('../../dist/cli/cli-parser').default;


describe('CLI tests', function () {
    it(`Should correctly parse CLI arguments without appName`, async () => {
        const args    = [
            '--template', 'typescript',
            '--run-wizard', 'true',
            '--test-folder', 'custom',
            '--github-actions-init', 'false',
            '--include-sample-tests', 'false',
        ];
        const options = new InitOptions();

        await setCliOptions(options, args);

        expect(options.template.hasSet).toEqual(true);
        expect(options.template.value).toEqual('typescript');

        expect(options.runWizard.hasSet).toEqual(true);
        expect(options.runWizard.value).toEqual(true);

        expect(options.testFolder.hasSet).toEqual(true);
        expect(options.testFolder.value).toEqual('custom');

        expect(options.githubActionsInit.hasSet).toEqual(true);
        expect(options.githubActionsInit.value).toEqual(false);

        expect(options.includeSampleTests.hasSet).toEqual(true);
        expect(options.includeSampleTests.value).toEqual(false);
    });

    it(`Should correctly parse CLI arguments with appName`, async () => {
        const appName = 'my-app';
        const args    = [
            appName,
            '--template', 'javascript',
            '--run-wizard', 'false',
            '--test-folder', 'test-test',
            '--github-actions-init', 'true',
            '--include-sample-tests', 'true',
        ];
        const options = new InitOptions();

        await setCliOptions(options, args);

        expect(options.template.hasSet).toEqual(true);
        expect(options.template.value).toEqual('javascript');

        expect(options.runWizard.hasSet).toEqual(true);
        expect(options.runWizard.value).toEqual(false);

        expect(options.testFolder.hasSet).toEqual(true);
        expect(options.testFolder.value).toEqual('test-test');

        expect(options.githubActionsInit.hasSet).toEqual(true);
        expect(options.githubActionsInit.value).toEqual(true);

        expect(options.includeSampleTests.hasSet).toEqual(true);
        expect(options.includeSampleTests.value).toEqual(true);

        expect(options.rootPath.hasSet).toEqual(true);
        expect(options.rootPath.value).toEqual(path.join(process.cwd(), appName));
    });

    it(`Should correctly display help message`, async () => {
        const cliMock = `node -e "require('./dist/cli/cli-parser').default({}, ['--help'])"`;

        const { stdout } = await spawnAsync(cliMock, { shell: true, cwd: process.cwd() });

        await expect(stdout).toEqual('Usage: create-testcafe <appPath> [options]\n' +
                                     '\n' +
                                     'Options:\n' +
                                     '      --help                  Show help                                [boolean]\n' +
                                     '      --version               Show version number                      [boolean]\n' +
                                     '      --template              Project template: javascript or typescript[string]\n' +
                                     '      --test-folder           Test subfolder path                       [string]\n' +
                                     '  -w, --run-wizard            Launch the interactive wizard            [boolean]\n' +
                                     '      --github-actions-init   Add a GitHub Actions workflow file       [boolean]\n' +
                                     '      --include-sample-tests  Add sample tests                         [boolean]\n');
    });
});
