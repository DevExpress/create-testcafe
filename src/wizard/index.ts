import { Dictionary } from '../interfaces';
import { InitOptions } from '../options/init-options';
import { prompt } from 'enquirer';
import { TEMPLATES } from '../options/templates';
import {
    RUN_NPM_INSTALL, SELECT_TEMPLATE, SELECT_TESTS_FOLDER,
} from './questions';
import { validateTestsFolder } from './validators';

function setInitialValues (questions: any[], initials: Dictionary<any>): any[] {
    return questions.map(question => {
        if (question.name in initials)
            question.initial = initials[question.name];

        return question;
    });
}

function calculateInitialValues (initOpts: InitOptions): Dictionary<any> {
    const template                       = initOpts.template || initOpts.projectType || TEMPLATES.typescript;
    const { testsFolder, runNpmInstall } = initOpts;

    return { template, testsFolder, runNpmInstall };
}

function setValidators (questions: any[], validators: Dictionary<any>, initOptions: InitOptions): any[] {
    return questions.map(question => {
        if (question.name in validators)
            question.validate = validators[question.name](initOptions);

        return question;
    });
}

export default async function runWizard (initOpts: InitOptions): Promise<Dictionary<any>> {
    const initialValues = calculateInitialValues(initOpts);
    const validators    = { testsFolder: validateTestsFolder };
    let questions       = [ SELECT_TEMPLATE, SELECT_TESTS_FOLDER, RUN_NPM_INSTALL ];

    questions = setInitialValues(questions, initialValues);
    questions = setValidators(questions, validators, initOpts);

    const answers = await prompt(questions);

    return answers;
}
