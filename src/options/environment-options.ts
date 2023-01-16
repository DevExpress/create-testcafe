import path from 'path';
import InitOptions, { INIT_OPTIONS_NAMES } from './init-options';
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
        [INIT_OPTIONS_NAMES.projectType]:  projectType,
        [INIT_OPTIONS_NAMES.tcConfigType]: tcConfigType,
        [INIT_OPTIONS_NAMES.runWizard]:    runWizard,
    };

    options.merge(opts);
}
