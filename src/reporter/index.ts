import InitOptions from '../options/init-options';
import {
    bold,
    green,
    white,
    italic,
} from 'chalk';
import { MESSAGES } from './messages';
import path from 'path';
// @ts-ignore
import OS from 'os-family';

const TESTCAFE_LOGO = 'Test' + italic('Café');

export default class Reporter {
    reportActionStarted (action: string): void {
        const message = `${ MESSAGES[action] }`;

        console.log(message);
    }

    error (err: Error): void {
        console.log('Error occurred during the installation process:');
        console.error(err);
    }

    reportTemplateInitStarted ({ rootPath, template, testFolder, addTests, createGithubWorkflow }: InitOptions): void {
        console.log(`Initializing ${ TESTCAFE_LOGO } project in '${ white(rootPath) }' with the following options:`);
        console.log(`Template: ${ template }`);
        console.log(`Test folder: ${ testFolder }`);
        console.log(`Add basic tests suite: ${ addTests ? 'Yes' : 'No' }`);
        console.log(`Create GitHub workflow: ${ createGithubWorkflow ? 'Yes' : 'No' }\n`);
    }

    _buildRunCommand ({ tcConfigType, testFolder }: InitOptions): string {
        const browser = OS.mac ? 'safari' : 'chrome';

        return tcConfigType ? `npx testcafe ${ browser } "${ testFolder }"` : `npx testcafe ${ browser }`;
    }

    reportTemplateInitSuccess (options: InitOptions): void {
        const appPath = path.relative(process.cwd(), options.rootPath);

        //TODO: FIX for absolute path.
        const moveToProjectFolderCommand = appPath ? `cd ${ appPath }\n` : '';
        const runTestcafeCommand         = this._buildRunCommand(options);

        console.log(`${ green(bold(`\nSuccess! Created a ${ TESTCAFE_LOGO } project at`)) } '${ white(options.rootPath) }'\n`);

        if (!options.tcConfigType)
            console.log('Check our getting started article: https://testcafe.io/documentation/402635/getting-started\n');

        if (moveToProjectFolderCommand)
            console.log(`We suggest that you begin by typing:\n${ moveToProjectFolderCommand }`);

        console.log(`Run the following command to run tests: ${ runTestcafeCommand }\n`);
    }
}
