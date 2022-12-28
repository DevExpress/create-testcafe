import InitOptions from '../options/init-options';
import {
    black,
    blue,
    bold,
    gray,
    green,
    red,
    white,
    yellowBright,
    italic,
    bgWhite,
} from 'chalk';
import { MESSAGES } from './messages';
import path from 'path';
// @ts-ignore
import OS from 'os-family';

const TESTCAFE_LOGO = bgWhite(` ${ bold(blue('✔ Test')) }${ italic(black('Café')) } `);

export default class Reporter {
    reportActionStarted (action: string): void {
        const message = `${ MESSAGES[action] }\n`;

        console.log(yellowBright(message));
    }

    error (err: Error): void {
        console.log(red('Error occurred during the installation process:'));
        console.error(err);
    }

    reportTemplateInitStarted ({ rootPath }: InitOptions): void {
        console.log(yellowBright(`Initializing ${ TESTCAFE_LOGO } project in '${ white(rootPath) }'\n`));
    }

    _buildRunCommand ({ tcConfigType, testFolder }: InitOptions): string {
        const browser = OS.mac ? 'safari' : 'chrome';

        return tcConfigType ? `testcafe ${ white(`${ browser } "${ testFolder }"`) }` : 'testcafe';
    }

    reportTemplateInitSuccess (options: InitOptions): void {
        const appPath                    = path.relative(process.cwd(), options.rootPath);
        const ampersand                  = gray('&&');
        const moveToProjectFolderCommand = appPath ? `${ yellowBright('cd') } ${ white(appPath) }` : '';
        const runTestcafeCommand         = this._buildRunCommand(options);

        const fullCommand = [ moveToProjectFolderCommand, runTestcafeCommand ].filter(c => !!c).join(` ${ ampersand } `);

        console.log(`${ green(bold('✔ Success!')) } ${ yellowBright(`Created a ${ TESTCAFE_LOGO } project at '${ white(options.rootPath) }'`) }`);
        console.log(yellowBright(`All the testcafe options can be applied in the ${ white(`.testcaferc.${ options.tcConfigType || 'js' }`) } configuration file: https://testcafe.io/documentation/402638/reference/configuration-file`));
        console.log(yellowBright(`As well as through CLI: https://testcafe.io/documentation/402639/reference/command-line-interface`));
        console.log(yellowBright(`Run the following command to run tests: ${ fullCommand }\n`));
    }
}
