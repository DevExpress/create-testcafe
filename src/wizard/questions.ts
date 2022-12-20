import { TEMPLATES } from '../options/templates';
import InitOptions from '../options/init-options';
import { testsFolderValidator } from './validators';

export function buildQuestions (initOpts: InitOptions): any[] {
    return [
        {
            type:    'select',
            name:    'template',
            message: 'Choose a project template',
            choices: Object.keys(TEMPLATES),
            initial: initOpts.template || initOpts.projectType || TEMPLATES.typescript,
        },
        {
            type:     'input',
            name:     'testFolder',
            message:  'Choose tests folder',
            initial:  initOpts.testFolder,
            validate: testsFolderValidator(initOpts),
        },
        {
            type:    'confirm',
            name:    'runNpmInstall',
            message: 'Do you want to run "npm install"',
            initial: initOpts.runNpmInstall,
        },
    ];
}
