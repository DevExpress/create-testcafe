import fs from 'fs/promises';
import * as path from 'path';
import { prompt } from 'inquirer';
import { execSync } from 'child_process';
// @ts-ignore
import OS from 'os-family';
import InitOptions from '../options/init-options';
import createConfig from './testcafe-config';
import Reporter from '../reporter';
import { ACTIONS } from '../reporter/actions';
import { pathExists, readDir } from '../utils';
import { packageManager } from '../package-manager';
import { parse, stringify } from 'yaml';
import { Dictionary } from '../interfaces';

const DEFAULT_TESTS_PATH_REGEX   = /tests[/\\].*/;
const GITHUB_WORKFLOW_PATH_REGEX = /\.github[/\\].*/;
const PACKAGE_JSON_NAME          = /package.json/;
const TEMPLATES_SRC_FOLDER       = path.join(__dirname, '..', 'templates');
const WORKFLOW_PATH              = '.github/workflows/testcafe.yml';

export default class TemplateGenerator {
    private readonly options: InitOptions;
    private readonly reporter: Reporter;

    constructor (options: InitOptions, reporter: Reporter) {
        this.options  = options;
        this.reporter = reporter;
    }

    async run (): Promise<void> {
        this.reporter.reportTemplateInitStarted(this.options);

        if (this.options.createGithubWorkflow.value)
            await this._updateGithubWorkflow();

        await this._copyTemplateFiles();

        if (!this.options.tcConfigType.hasSet)
            await this._createConfigFile();

        if (this.options.projectType.hasSet) {
            this.reporter.reportActionStarted(ACTIONS.addTestcafeToDependencies);
            await this._executeCommand(packageManager.installDevDependency('testcafe'));
        }
        else {
            this.reporter.reportActionStarted(ACTIONS.installAllDependencies);
            await this._executeCommand(packageManager.installAllDependencies());
        }

        this.reporter.reportTemplateInitSuccess(this.options);
    }

    private async _copyTemplateFiles (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.copyTemplate);

        const srcFolderPath = path.join(TEMPLATES_SRC_FOLDER, this.options.template.value);
        const paths         = await this._prepareFilePaths(srcFolderPath);

        for (const [ srcPath, distPath ] of paths)
            await fs.cp(srcPath, distPath);
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
            if (PACKAGE_JSON_NAME.test(p) && this.options.projectType.hasSet)
                continue;

            if (GITHUB_WORKFLOW_PATH_REGEX.test(p) && !this.options.createGithubWorkflow.value)
                continue;

            if (DEFAULT_TESTS_PATH_REGEX.test(p) && !this.options.addTests.value)
                continue;

            const distPath = DEFAULT_TESTS_PATH_REGEX.test(p)
                ? path.join(this.options.rootPath.value, this.options.testFolder.value, ...p.split(path.sep).slice(1))
                : path.join(this.options.rootPath.value, p);

            if (await pathExists(distPath)) {
                const { override } = await prompt({
                    type:    'confirm',
                    message: `The following file is already exists: ${ distPath }.\nDo you want to override it? `,
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
        execSync(command, {
            stdio: 'pipe',
            cwd:   this.options.rootPath.value,
        });
    }

    private async _updateGithubWorkflow (): Promise<void> {
        const wfPath         = path.join(TEMPLATES_SRC_FOLDER, this.options.template.value, WORKFLOW_PATH);
        const workflowString = await fs.readFile(wfPath, { encoding: 'utf-8' });
        const ymlObject      = parse(workflowString);
        const build          = ymlObject?.jobs?.build;
        const runStep        = build?.steps?.find((s: Dictionary<any>) => s.uses === 'DevExpress/testcafe-action@latest');

        if (!build || !runStep)
            throw new Error(`GitHub workflow file has incorrect structure: ${ wfPath }`);

        build['runs-on'] = OS.win ? 'windows-latest' : 'ubuntu-latest';
        runStep.with     = { 'args': `chrome ${ this.options.testFolder.value }` };

        await fs.writeFile(wfPath, stringify(ymlObject), { encoding: 'utf-8' });
    }
}

