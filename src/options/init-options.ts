import { Dictionary } from '../interfaces';
import { TEMPLATES } from './templates';
import ensureTestsFolderValid from './validate-tests-folder';

type ProjectType = 'javascript' | 'typescript' | null;

export class InitOptions {
    template = '';
    testsFolder = 'tests';
    projectType: ProjectType = null;
    rootPath = '';
    runNpmInstall = true;
    testScriptName = 'test';
    silent = false;

    constructor (opts?: Dictionary<any>) {
        this.merge(opts);
    }

    merge (newOptions?: Dictionary<any>): void {
        console.log('Before:', JSON.stringify(this));
        console.log('ToMerge:', JSON.stringify(newOptions));
        if (!newOptions)
            return;

        for (const key in newOptions) {
            if (key in this)
                this[key as keyof this] = newOptions[key];
        }
        console.log('After:', JSON.stringify(this));
    }

    setUnsetOptionsToDefaults (): void {
        this.template = this.template || this.projectType || TEMPLATES.typescript;
    }

    validateAll (): void {
        this.ensureTemplateValid();
        this.ensureTestsFolderValid();
    }

    private ensureTemplateValid (): void {
        if (!(this.template in TEMPLATES))
            throw new Error(`Template prop must be one of ${ Object.keys(TEMPLATES).join(', ') }`);
    }

    private ensureTestsFolderValid (): void {
        return ensureTestsFolderValid(this.testsFolder, this.rootPath);
    }
}
