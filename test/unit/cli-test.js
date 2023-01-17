const {
    describe,
    it,
    expect,
}             = require('@jest/globals');
const path          = require('path');
const InitOptions   = require('../../dist/options/init-options').default;
const setCliOptions = require('../../dist/cli/cli-parser').default;


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
});
