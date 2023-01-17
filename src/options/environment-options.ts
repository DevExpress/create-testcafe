import path from 'path';
import InitOptions, { OPTION_NAMES } from './init-options';
import { ProjectType } from '../interfaces';
import { pathExists } from '../utils';

async function resolveProjectType (rootPath: string): Promise<ProjectType> {
    const packageJsonExists = await pathExists(path.join(rootPath, 'package.json'));
    const tsConfigExists    = await pathExists(path.join(rootPath, 'tsconfig.json'));

    if (tsConfigExists && packageJsonExists)
        return 'typescript';

    if (packageJsonExists)
        return 'javascript';

    return null;
}

async function resolveTestCafeConfigType (rootPath: string): Promise<'js' | 'json' | null> {
    if (await pathExists(path.join(rootPath, '.testcaferc.js')))
        return 'js';

    if (await pathExists(path.join(rootPath, '.testcaferc.json')))
        return 'json';

    return null;
}

export default async function setEnvironmentOptions (options: InitOptions): Promise<void> {
    const projectType  = await resolveProjectType(options.rootPath.value);
    const tcConfigType = await resolveTestCafeConfigType(options.rootPath.value);
    const runWizard    = options.runWizard.hasSet ? options.runWizard.value : projectType || tcConfigType;

    const opts = {
        [OPTION_NAMES.projectType]:  projectType,
        [OPTION_NAMES.tcConfigType]: tcConfigType,
        [OPTION_NAMES.runWizard]:    runWizard,
    };

    options.merge(opts);
}
