import { ACTIONS } from './actions';

export const MESSAGES = {
    [ACTIONS.copyTemplate]:              'Copying file templates...',
    [ACTIONS.installAllDependencies]:    'Installing dependencies...',
    [ACTIONS.addTestcafeToDependencies]: 'Adding TestCafe to project dependencies...',
    [ACTIONS.createConfig]:              'Generating a configuration file...',
    [ACTIONS.createGithubWorkflow]:      'Generating a GitHub Actions workflow...',
};
