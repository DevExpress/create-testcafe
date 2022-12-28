import path from 'path';
import InitOptions from './init-options';
import { ProjectTemplate } from '../interfaces';
import { pathExists } from '../utils';

async function resolveProjectType (rootPath: string): Promise<ProjectTemplate | null> {
    const packageJsonExists = await pathExists(path.join(rootPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && await pathExists(path.join(rootPath, '.tsconfig.json'));

    if (tsConfigExists)
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
    const projectType   = await resolveProjectType(options.rootPath);
    const tcConfigType = await resolveTestCafeConfigType(options.rootPath);

    options.merge({ projectType, tcConfigType });
}
