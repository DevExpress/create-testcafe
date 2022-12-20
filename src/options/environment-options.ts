import { Dictionary } from '../interfaces';
import path from 'path';
import { TEMPLATES } from './templates';
import * as fs from 'fs';
import InitOptions from './init-options';

function resolveProjectType (rootPath: string, appPath: string): string | null {
    const packageJsonExists = fs.existsSync(path.join(rootPath, appPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && fs.existsSync(path.join(rootPath, appPath, '.tsconfig.json'));

    if (tsConfigExists)
        return TEMPLATES.typescript;

    if (packageJsonExists)
        return TEMPLATES.javascript;

    return null;
}

export default function setEnvironmentOptions ({ appPath, merge }: InitOptions): void {
    const rootPath    = path.resolve(process.cwd(), '');
    const projectType = resolveProjectType(rootPath, appPath);

    merge({
        rootPath,
        projectType,
    });
}
