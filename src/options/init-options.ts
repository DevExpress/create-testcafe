import { Dictionary, ProjectTemplate } from '../interfaces';
import { TEMPLATES } from './templates';
import path from 'path';
import fs from 'fs';

export default class InitOptions {
    template: ProjectTemplate | null = null;
    projectType: ProjectTemplate | null = null;
    tcConfigType: 'js' | 'json' | null = null;
    runWizard: boolean | null = null;
    createGithubWorkflow: boolean | null = null;
    rootPath = process.cwd();
    testFolder = 'tests';
    addTests = true;

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

    setDefaults (): void {
        this.template             = this.template || this.projectType || 'typescript';
        this.runWizard            = this.runWizard !== null ? this.runWizard : !!this.projectType;
        this.createGithubWorkflow = this.createGithubWorkflow !== null ? this.createGithubWorkflow : true;
    }

    validateAll (): void {
        this._ensureTemplateValid();
        this.ensureTestsFolderValid(this.testFolder);
    }

    ensureTestsFolderValid (value: string): boolean {
        if (!value)
            throw new Error(`Invalid tests folder path: "${ value }"`);

        const testsFolderPath = path.join(this.rootPath, value);

        if (!fs.existsSync(testsFolderPath))
            return true;

        if (!fs.statSync(testsFolderPath).isDirectory())
            throw new Error(`The specified tests path is not a folder: ${ testsFolderPath }`);

        if (fs.readdirSync(testsFolderPath).length !== 0)
            throw new Error(`Folder with name tests contains files inside`);

        return true;
    }

    private _ensureTemplateValid (): void {
        if (!this.template || !(this.template in TEMPLATES))
            throw new Error(`Template prop must be one of ${ Object.keys(TEMPLATES).join(', ') }`);
    }
}
