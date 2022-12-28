import { TEMPLATES } from '../options/templates';
import InitOptions from '../options/init-options';
import { testsFolderValidator } from './validators';
import { OPTIONS_NAMES } from './option-names';


export function buildQuestions (initOpts: InitOptions): any[] {
    return [
        {
            type:    'select',
            name:    OPTIONS_NAMES.template,
            message: 'Choose a project template',
            choices: Object.keys(TEMPLATES),
            initial: initOpts.template,
        },
        {
            type:     'input',
            name:     OPTIONS_NAMES.testFolder,
            message:  'Choose tests folder',
            initial:  initOpts.testFolder,
            validate: testsFolderValidator(initOpts),
        },
        {
            type:    'confirm',
            name:    OPTIONS_NAMES.addTests,
            message: 'Do you want to add tests example suit?',
            initial: initOpts.addTests,
        },
        {
            type:    'confirm',
            name:    OPTIONS_NAMES.createGithubWorkflow,
            message: 'Do you want to create a GitHub workflow?',
            initial: initOpts.createGithubWorkflow,
        },
    ];
}
