import { Dictionary } from '../interfaces';
import { TEMPLATES } from './templates';
import ensureTestsFolderValid from './validate-tests-folder';

type ProjectType = 'javascript' | 'typescript' | null;

export default class InitOptions {
    template = '';
    testFolder = 'tests';
    projectType: ProjectType = null;
    rootPath = '';
    runNpmInstall = true;
    testScriptName = 'test';
    silent = false;
    appPath = '.';

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
        this.ensureTemplateValid();
        this.ensureTestsFolderValid();
    }

    private ensureTemplateValid (): void {
        if (!(this.template in TEMPLATES))
            throw new Error(`Template prop must be one of ${ Object.keys(TEMPLATES).join(', ') }`);

    }

    private ensureTestsFolderValid (): void {
        return ensureTestsFolderValid(this.testFolder, this.rootPath);
    }
}
