import { Dictionary, ProjectType } from '../interfaces';
import { TEMPLATES } from './templates';
import path from 'path';
import fs from 'fs';

export default class InitOptions {
    template = '';
    testFolder = 'tests';
    projectType: ProjectType = null;
    rootPath = '';
    runNpmInstall = true;
    testScriptName = 'test';
    silent = false;
    appPath = '.';
    createGithubWorkflow = true;
    configFileName = '';

    constructor (opts?: Dictionary<any>) {
        this.merge(opts);
    }

    merge (newOptions?: Dictionary<any>): void {
        if (!newOptions)
            return;

        for (const key in newOptions) {
            if (key in this)
                this[key as keyof this] = newOptions[key];
        }
    }

    setUnsetOptionsToDefaults (): void {
        this.template = this.template || this.projectType || TEMPLATES.typescript;
    }

    validateAll (): void {
        this._ensureTemplateValid();
        this.ensureTestsFolderValid(this.testFolder);
    }

    ensureTestsFolderValid (value: string): boolean {
        if (!value)
            throw new Error(`Invalid tests folder path: "${ value }"`);

        const testsFolderPath = path.join(this.rootPath, this.appPath, value);

        if (!fs.existsSync(testsFolderPath))
            return true;

        if (!fs.statSync(testsFolderPath).isDirectory())
            throw new Error(`The specified tests path is not a folder: ${ testsFolderPath }`);

        if (fs.readdirSync(testsFolderPath).length !== 0)
            throw new Error(`Folder with name tests contains files inside`);

        return true;
    }

    private _ensureTemplateValid (): void {
        if (!(this.template in TEMPLATES))
            throw new Error(`Template prop must be one of ${ Object.keys(TEMPLATES).join(', ') }`);

    }
}
