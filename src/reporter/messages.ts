import { ACTIONS } from './actions';

export const MESSAGES = {
    [ACTIONS.copyTemplate]:              'Coping template files...',
    [ACTIONS.installAllDependencies]:    'Installing dependencies...',
    [ACTIONS.installTestCafeGlobally]:   'Installing TestCafe globally...',
    [ACTIONS.addTestcafeToDependencies]: 'Adding TestCafe to project dependencies...',
    [ACTIONS.createConfig]:              'Creating configuration file...',
    [ACTIONS.createGithubWorkflow]:      'Creating GitHub workflow...',
};
