const {
    describe,
    it,
    expect,
}              = require('@jest/globals');
const { spawnAsync } = require('../utils');
const path           = require('path');

describe('CLI tests', function () {
    it(`Should correctly parse CLI arguments without appName`, async () => {
        const args = {
            template:               'typescript',
            'run-wizard':           'true',
            'test-folder':          'custom',
            'github-actions-init':  'false',
            'include-sample-tests': 'false',
        };

        const argsString = Object.entries(args)
            .map(([key, value]) => `--${ key } ${ value }`)
            .join(' ');

        const command = [
            'node',
            path.join(__dirname, '..', 'utils', 'cli-mock.js'),
            argsString,
        ]
            .filter(arg => !!arg)
            .join(' ');

        const { stdout }      = await spawnAsync(command, { shell: true });
        const resultOptions   = stdout.split('\n').map(optionString => optionString.split('='));
        const expectedOptions = [
            ['template', 'typescript'],
            ['runWizard', 'Yes'],
            ['testFolder', 'custom'],
            ['githubActionsInit', 'No'],
            ['includeSampleTests', 'No'],
            ['rootPath', process.cwd()],
            ['projectType', 'null'],
            ['tcConfigType', 'null'],
        ];

        resultOptions.pop();
        resultOptions.sort();
        expectedOptions.sort();

        expect(resultOptions).toEqual(expectedOptions);
    });

    it(`Should correctly parse CLI arguments with appName`, async () => {
        const appName = 'my-app';
        const args    = {
            template:               'javascript',
            'run-wizard':           'false',
            'test-folder':          'test-test',
            'github-actions-init':  'true',
            'include-sample-tests': 'true',
        };

        const argsString = Object.entries(args)
            .map(([key, value]) => `--${ key } ${ value }`)
            .join(' ');

        const command = [
            'node',
            path.join(__dirname, '..', 'utils', 'cli-mock.js'),
            appName,
            argsString,
        ]
            .filter(arg => !!arg)
            .join(' ');

        const { stdout }      = await spawnAsync(command, { shell: true });
        const resultOptions   = stdout.split('\n').map(optionString => optionString.split('='));
        const expectedOptions = [
            ['template', 'javascript'],
            ['runWizard', 'No'],
            ['testFolder', 'test-test'],
            ['githubActionsInit', 'Yes'],
            ['includeSampleTests', 'Yes'],
            ['rootPath', path.join(process.cwd(), appName)],
            ['projectType', 'null'],
            ['tcConfigType', 'null'],
        ];

        resultOptions.pop();
        resultOptions.sort();
        expectedOptions.sort();

        expect(resultOptions).toEqual(expectedOptions);
    });
});
