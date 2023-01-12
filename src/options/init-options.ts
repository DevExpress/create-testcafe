import {
    Dictionary, ProjectTemplate, ProjectType,
} from '../interfaces';
import { TEMPLATES } from './templates';
import path from 'path';
import fs from 'fs';
import { Option } from './Option';

export default class InitOptions {
    template: Option<ProjectTemplate>;
    projectType: Option<ProjectType>;
    tcConfigType: Option<'js' | 'json'>;
    runWizard: Option<boolean>;
    addGithubActions: Option<boolean>;
    rootPath: Option<string>;
    testFolder: Option<string>;
    addTests: Option<boolean>;

    constructor (opts?: Dictionary<any>) {
        this.template             = new Option('javascript');
        this.projectType          = new Option('javascript');
        this.tcConfigType         = new Option('js');
        this.runWizard        = new Option(false);
        this.addGithubActions = new Option(true);
        this.rootPath         = new Option(process.cwd());
        this.testFolder           = new Option('tests');
        this.addTests             = new Option(true);

        this.merge(opts);
    }

    merge (newOptions?: Dictionary<any>): void {
        if (!newOptions)
            return;

        for (const key in newOptions) {
            if (!(key in this))
                continue;

            const opt = this[key as keyof this];

            if (opt instanceof Option)
                opt.value = newOptions[key];
        }
    }

    validateAll (): void {
        this._ensureTemplateValid();
        this.ensureTestsFolderValid(this.testFolder.value);
    }

    ensureTestsFolderValid (value: string | null): boolean {
        if (!value || typeof value !== 'string')
            throw new Error(`Invalid tests folder path: "${ value }"`);

        const testsFolderPath = path.join(this.rootPath.value, value);

        if (!fs.existsSync(testsFolderPath))
            return true;

        if (!fs.statSync(testsFolderPath).isDirectory())
            throw new Error(`The specified tests path is not a folder: ${ testsFolderPath }`);

        if (fs.readdirSync(testsFolderPath).length !== 0)
            throw new Error(`Folder with name ${ testsFolderPath } contains files inside`);

        return true;
    }

    private _ensureTemplateValid (): void {
        if (!(this.template.value in TEMPLATES))
            throw new Error(`Template prop must be one of ${ Object.keys(TEMPLATES).join(', ') }`);
    }
}
