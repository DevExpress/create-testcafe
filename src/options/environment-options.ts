import path from 'path';
import * as fs from 'fs';
import InitOptions from './init-options';
import { ProjectTemplate } from '../interfaces';

function resolveProjectType (rootPath: string): ProjectTemplate | null {
    const packageJsonExists = fs.existsSync(path.join(rootPath, 'package.json'));
    const tsConfigExists    = packageJsonExists && fs.existsSync(path.join(rootPath, '.tsconfig.json'));

    if (tsConfigExists)
        return 'typescript';

    if (packageJsonExists)
        return 'javascript';

    return null;
}

export default function setEnvironmentOptions (options: InitOptions): void {
    const projectType = resolveProjectType(options.rootPath);
    const template    = options.template || projectType;
    const runWizard   = options.runWizard !== null ? options.runWizard : !!projectType;

    options.merge({ template, runWizard });
}
