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
} from 'chalk';
import { MESSAGES } from './messages';
import path from 'path';

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
        console.log(yellowBright(`Initializing ${ bold(blue('✔ Test')) }${ black('Café') } project in '${ white(rootPath) }'\n`));
    }

    reportTemplateInitSuccess ({ testScriptName, runNpmInstall, rootPath, configFileName }: InitOptions): void {
        const appPath   = path.relative(process.cwd(), rootPath);
        const ampersand = gray('&&');
        let command     = `${ yellowBright('npm') } ${ white(`run ${ testScriptName }`) }`;

        command = runNpmInstall ? command : `${ yellowBright('npm') } ${ white('i') } ${ ampersand } ${ command }`;
        command = !appPath ? command : `${ yellowBright('cd') } ${ white(appPath) } ${ ampersand } ${ command }`;

        console.log(`${ green(bold('✔ Success!')) } ${ bold(`Created a TestCafe project at '${ rootPath }'`) }`);
        console.log(bold(`You can choose the browser and tests source in the ${ configFileName } configuration file.`));
        console.log(bold(`Run the following command to run tests: ${ command }\n`));
    }
}
