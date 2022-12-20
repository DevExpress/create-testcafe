import InitOptions from '../options/init-options';
import { prompt } from 'enquirer';
import { buildQuestions } from './questions';


export default async function runWizard (initOpts: InitOptions): Promise<void> {
    const questions = buildQuestions(initOpts);
    const answers   = await prompt(questions);

    initOpts.merge(answers);
}
