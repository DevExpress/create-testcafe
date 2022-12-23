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

const TESTCAFE_LOGO = bgWhite(`${ bold(blue('✔ Test')) }${ italic(black('Café')) }`);

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

    reportTemplateInitSuccess ({ testScriptName, runNpmInstall, rootPath, configFileName }: InitOptions): void {
        const appPath   = path.relative(process.cwd(), rootPath);
        const ampersand = gray('&&');
        let command     = `${ yellowBright('npm') } ${ white(`run ${ testScriptName }`) }`;

        command = runNpmInstall ? command : `${ yellowBright('npm') } ${ white('i') } ${ ampersand } ${ command }`;
        command = !appPath ? command : `${ yellowBright('cd') } ${ white(appPath) } ${ ampersand } ${ command }`;

        console.log(`${ green(bold('✔ Success!')) } ${ yellowBright(`Created a ${ TESTCAFE_LOGO } project at '${ white(rootPath) }'`) }`);
        console.log(yellowBright(`You can choose the browser and tests source in the ${ white(configFileName) } configuration file.`));
        console.log(yellowBright(`Run the following command to run tests: ${ command }\n`));
    }
}
