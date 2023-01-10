import path from 'path';
import InitOptions from './init-options';
import { ProjectTemplate } from '../interfaces';
import { pathExists } from '../utils';

async function resolveProjectType (rootPath: string): Promise<ProjectTemplate | undefined> {
    const packageJsonExists = await pathExists(path.join(rootPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && await pathExists(path.join(rootPath, '.tsconfig.json'));

    if (tsConfigExists)
        return 'typescript';

    if (packageJsonExists)
        return 'javascript';

    return void 0;
}

async function resolveTestCafeConfigType (rootPath: string): Promise<'js' | 'json' | undefined> {
    if (await pathExists(path.join(rootPath, '.testcaferc.js')))
        return 'js';

    if (await pathExists(path.join(rootPath, '.testcaferc.json')))
        return 'json';

    return void 0;
}

export default async function setEnvironmentOptions (options: InitOptions): Promise<void> {
    const projectType  = await resolveProjectType(options.rootPath.value);
    const tcConfigType = await resolveTestCafeConfigType(options.rootPath.value);
    const runWizard    = options.runWizard.hasSet ? options.runWizard.value : projectType || tcConfigType;

    options.merge({ projectType, tcConfigType, runWizard });
}
