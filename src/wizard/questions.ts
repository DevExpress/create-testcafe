import { TEMPLATES } from '../options/templates';
import InitOptions from '../options/init-options';
import { testsFolderValidator } from './validators';
import { OPTIONS_NAMES } from './option-names';


export function buildQuestions (initOpts: InitOptions): any[] {
    return [
        {
            type:    'list',
            name:    OPTIONS_NAMES.template,
            message: 'Select a template for your project',
            choices: Object.keys(TEMPLATES),
            default: initOpts.template.hasSet ? initOpts.template.value : initOpts.projectType.value,
        },
        {
            type:     'input',
            name:     OPTIONS_NAMES.testFolder,
            message:  'Specify the test folder path',
            default:  initOpts.testFolder.value,
            validate: testsFolderValidator(initOpts),
        },
        {
            type:    'confirm',
            name:    OPTIONS_NAMES.addTests,
            message: 'Do you want to initialize the project with sample tests?',
            default: initOpts.addTests.value,
        },
        {
            type:    'confirm',
            name:    OPTIONS_NAMES.createGithubWorkflow,
            message: 'Do you want to initialize the project with a GitHub Actions workflow template?',
            default: initOpts.addGithubActions.value,
        },
    ];
}
