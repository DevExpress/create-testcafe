import { TEMPLATES } from '../options/templates';

export const SELECT_TEMPLATE = {
    type:    'select',
    name:    'template',
    message: 'Choose a project template',
    choices: Object.keys(TEMPLATES),
};

export const SELECT_TESTS_FOLDER = {
    type:    'input',
    name:    'testsFolder',
    message: 'Choose tests folder',
};

export const RUN_NPM_INSTALL = {
    type:    'confirm',
    name:    'runNpmInstall',
    message: 'Do you want to run "npm install"',
};
