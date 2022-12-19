import { Dictionary } from '../interfaces';
import path from 'path';
import { TEMPLATES } from './templates';
import * as fs from 'fs';

function resolveProjectType (rootPath: string): string | null {
    const packageJsonExists = fs.existsSync(path.join(rootPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && fs.existsSync(path.join(rootPath, '.tsconfig.json'));

    if (tsConfigExists)
        return TEMPLATES.typescript;

    if (packageJsonExists)
        return TEMPLATES.javascript;

    return null;
}

export default function getEnvironmentOptions (): Dictionary<any> {
    const rootPath    = path.resolve(process.cwd(), '');
    const projectType = resolveProjectType(rootPath);

    return {
        rootPath,
        projectType,
    };
}
