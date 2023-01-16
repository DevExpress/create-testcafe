import InitOptions from '../options/init-options';
import {
    green,
    white,
    italic,
    red,
} from 'chalk';
import { MESSAGES } from './messages';
import path from 'path';
// @ts-ignore
import OS from 'os-family';
import Option from '../options/option';
import { packageManager } from '../package-manager';

const TESTCAFE_LOGO                = 'Test' + italic('Café');
const GETTING_STARTED_ARTICLE_LINK = 'https://testcafe.io/documentation/402635/getting-started';
const HAS_SET_TEXT                 = {
    'default':  '(default)',
    'selected': '(you selected this)',
};


export default class Reporter {
    reportActionStarted (action: string): void {
        const message = `${ MESSAGES[action] }`;

        console.log(message);
    }

    error (err: Error): void {
        console.log(red('An error occurred during the installation process:'));
        console.log(red(err.message));
        console.error(err.stack?.replace(`Error: ${ err.message }`, ''));
    }

    reportTemplateInitStarted ({
        rootPath,
        template,
        testFolder,
        includeSampleTests,
        githubActionsInit,
    }: InitOptions): void {
        console.log(`\nInitializing a new ${ TESTCAFE_LOGO } project at '${ white(rootPath) }'. Selected settings:`);
        console.log(this._buildOptionPropText('Template', template));
        console.log(this._buildOptionPropText('Test location', testFolder));
        console.log(this._buildOptionPropText('Populate the project with sample tests', includeSampleTests));
        console.log(this._buildOptionPropText('Create a GitHub Actions workflow', githubActionsInit));
    }

    _buildOptionPropText (description: string, prop: Option<any>): string {
        return `   ${ description }: ${ prop } ${ prop.hasSet ? HAS_SET_TEXT.selected : HAS_SET_TEXT.default }`;
    }

    _buildRunCommand ({ tcConfigType, testFolder }: InitOptions): string {
        const browser = OS.mac ? 'safari' : 'chrome';
        const command = `${ packageManager.npxCommand } testcafe ${ browser }`;

        return tcConfigType.value ? `${ command } "${ testFolder }"` : command;
    }

    reportTemplateInitSuccess (options: InitOptions): void {
        const appPath = path.relative(process.cwd(), options.rootPath.value);

        const moveToProjectFolderCommand = appPath ? `cd ${ appPath }` : '';
        const runTestcafeCommand         = this._buildRunCommand(options);

        console.log(`${ green.bold(`\nSuccess! Created a ${ TESTCAFE_LOGO } project at`) } '${ white(options.rootPath) }'\n`);

        if (!options.tcConfigType.value)
            console.log(`Read the Getting Started guide to learn more about TestCafe: ${ GETTING_STARTED_ARTICLE_LINK }\n`);

        if (moveToProjectFolderCommand)
            console.log(`Go to the project directory to run your first test: ${ white.bgBlackBright(moveToProjectFolderCommand) }\n`);

        console.log(`Execute the following command to run tests: ${ white.bgBlackBright(runTestcafeCommand) }\n`);
    }
}
