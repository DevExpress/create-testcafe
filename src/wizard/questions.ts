import { TEMPLATES } from '../options/templates';
import InitOptions, { INIT_OPTIONS_NAMES } from '../options/init-options';
import { testsFolderValidator } from './validators';


export function buildQuestions (initOpts: InitOptions): any[] {
    return [
        {
            type:    'list',
            name:    INIT_OPTIONS_NAMES.template,
            message: 'Select a template for your project',
            choices: Object.keys(TEMPLATES),
            default: initOpts.template.hasSet ? initOpts.template.value : initOpts.projectType.value ?? initOpts.template.value,
        },
        {
            type:     'input',
            name:     INIT_OPTIONS_NAMES.testFolder,
            message:  'Specify the test folder path',
            default:  initOpts.testFolder.value,
            validate: testsFolderValidator(initOpts),
        },
        {
            type:    'confirm',
            name:    INIT_OPTIONS_NAMES.includeExampleTest,
            message: 'Do you want to initialize the project with sample tests?',
            default: initOpts.includeExampleTest.value,
        },
        {
            type:    'confirm',
            name:    INIT_OPTIONS_NAMES.githubActionsInit,
            message: 'Do you want to initialize the project with a GitHub Actions workflow template?',
            default: initOpts.githubActionsInit.value,
        },
    ];
}
