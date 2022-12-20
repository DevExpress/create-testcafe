import path from 'path';
import * as fs from 'fs';
import InitOptions from './init-options';
import { ProjectType } from '../interfaces';

function resolveProjectType (rootPath: string, appPath: string): ProjectType {
    const packageJsonExists = fs.existsSync(path.join(rootPath, appPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && fs.existsSync(path.join(rootPath, appPath, '.tsconfig.json'));

    if (tsConfigExists)
        return 'typescript';

    if (packageJsonExists)
        return 'javascript';

    return null;
}

export default function setEnvironmentOptions (initOptions: InitOptions): void {
    const rootPath    = path.resolve(process.cwd(), '');
    const projectType = resolveProjectType(rootPath, initOptions.appPath);

    initOptions.merge({
        rootPath,
        projectType,
    });
}
