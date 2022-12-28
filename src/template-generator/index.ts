import * as fs from 'fs';
import * as path from 'path';
import InitOptions from '../options/init-options';
import createConfig from './create-config';
import Reporter from '../reporter';
import { ACTIONS } from '../reporter/actions';
import { prompt } from 'inquirer';
import { pathExists, readDir } from '../utils';
import { packageManager } from '../package-manager';
import { execSync } from 'child_process';

const DEFAULT_TESTS_PATH_REGEX   = /tests\\.*/;
const GITHUB_WORKFLOW_PATH_REGEX = /\.github\\.*/;
const PACKAGE_JSON_NAME          = /package.json/;
const TEMPLATES_SRC_FOLDER       = path.join(__dirname, '..', 'templates');

export default class TemplateGenerator {
    private readonly options: InitOptions;
    private readonly reporter: Reporter;

    constructor (options: InitOptions, reporter: Reporter) {
        this.options  = options;
        this.reporter = reporter;
    }

    async run (): Promise<void> {
        this.reporter.reportTemplateInitStarted(this.options);

        await this._copyTemplateFiles();

        if (!this.options.tcConfigType)
            await this._createConfigFile();

        this.reporter.reportActionStarted(ACTIONS.installTestCafeGlobally);
        this._executeCommand(packageManager.installGlobally('testcafe'));

        if (this.options.projectType) {
            this.reporter.reportActionStarted(ACTIONS.addTestcafeToDependencies);
            this._executeCommand(packageManager.installDevDependency('testcafe'));
        }

        this.reporter.reportTemplateInitSuccess(this.options);
    }

    private async _copyTemplateFiles (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.copyTemplate);

        const srcFolderPath = path.join(TEMPLATES_SRC_FOLDER, this.options.template as string);
        const paths         = await this._prepareFilePaths(srcFolderPath);

        for (const [ srcPath, distPath ] of paths)
            await fs.promises.cp(srcPath, distPath);
    }

    private _createConfigFile (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.createConfig);

        return createConfig(this.options);
    }

    private async _prepareFilePaths (srcFolderPath: string): Promise<Map<string, string>> {
        const result   = new Map<string, string>();
        const srcPaths = await readDir(srcFolderPath)
            .then(paths => paths.map(p => path.relative(srcFolderPath, p)));

        for (const p of srcPaths) {
            if (PACKAGE_JSON_NAME.test(p) && this.options.projectType)
                continue;

            if (GITHUB_WORKFLOW_PATH_REGEX.test(p) && !this.options.createGithubWorkflow)
                continue;

            if (DEFAULT_TESTS_PATH_REGEX.test(p) && !this.options.addTests)
                continue;

            const distPath = DEFAULT_TESTS_PATH_REGEX.test(p)
                ? path.join(this.options.rootPath, this.options.testFolder, ...p.split(path.sep).slice(1))
                : path.join(this.options.rootPath, p);

            if (await pathExists(distPath)) {
                const { override } = await prompt({
                    type:    'confirm',
                    message: `The following file is already exists: ${ distPath }.\nDo you want to override it?`,
                    name:    'override',
                });

                if (!override)
                    continue;
            }

            result.set(path.join(srcFolderPath, p), distPath);
        }

        return result;
    }

    _executeCommand (command: string): void {
        execSync(command, { cwd: this.options.rootPath });
    }
}

