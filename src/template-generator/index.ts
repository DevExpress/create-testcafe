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

        await this._copyTemplateFiles();

        if (!this.options.tcConfigType.value)
            await this._createConfigFile();

        if (this.options.projectType.value) {
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
        const filesMap      = await this._prepareFiles(srcFolderPath);

        for (const [ distPath, content ] of filesMap) {
            if (await pathExists(distPath)) {
                const { override } = await prompt({
                    type:    'confirm',
                    message: `The following file is already exists: ${ distPath }.\nDo you want to override it? `,
                    name:    'override',
                });

                if (!override)
                    continue;
            }

            const distPathDir = path.dirname(distPath);

            if (!await pathExists(distPathDir))
                await fs.mkdir(distPathDir, { recursive: true });

            await fs.writeFile(distPath, content, { encoding: 'utf-8' });
        }
    }

    private _createConfigFile (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.createConfig);

        return createConfig(this.options);
    }

    private async _prepareFiles (srcFolderPath: string): Promise<Map<string, string>> {
        const result   = new Map<string, string>();
        const srcPaths = await readDir(srcFolderPath)
            .then(paths => paths.map(p => path.relative(srcFolderPath, p)));

        const getFileContent: (p: string) => Promise<null | string> = async (p: string) => {
            if (PACKAGE_JSON_NAME.test(p) && this.options.projectType.value)
                return null;

            if (GITHUB_WORKFLOW_PATH_REGEX.test(p)) {
                if (this.options.githubActionsInit.value)
                    return await this._getUpdatedGithubWorkflowContent();

                return null;
            }

            if (DEFAULT_TESTS_PATH_REGEX.test(p) && !this.options.includeExampleTest.value)
                return null;

            return await fs.readFile(path.join(srcFolderPath, p), 'utf-8');
        };

        for (const p of srcPaths) {
            const distPath = DEFAULT_TESTS_PATH_REGEX.test(p)
                ? path.join(this.options.rootPath.value, this.options.testFolder.value, ...p.split(path.sep).slice(1))
                : path.join(this.options.rootPath.value, p);

            const fileContent = await getFileContent(p);

            if (fileContent)
                result.set(distPath, fileContent);
        }

        return result;
    }

    _executeCommand (command: string): void {
        execSync(command, {
            stdio: 'pipe',
            cwd:   this.options.rootPath.value,
        });
    }

    private async _getUpdatedGithubWorkflowContent (): Promise<string> {
        this.reporter.reportActionStarted(ACTIONS.createGithubWorkflow);

        const wfPath         = path.join(TEMPLATES_SRC_FOLDER, this.options.template.value, WORKFLOW_PATH);
        const workflowString = await fs.readFile(wfPath, { encoding: 'utf-8' });
        const ymlObject      = parse(workflowString);
        const build          = ymlObject?.jobs?.build;
        const runStep        = build?.steps?.find((s: Dictionary<any>) => s.uses === 'DevExpress/testcafe-action@latest');

        if (!build || !runStep)
            throw new Error(`GitHub workflow file has incorrect structure: ${ wfPath }`);

        build['runs-on'] = OS.win ? 'windows-latest' : 'ubuntu-latest';
        runStep.with     = { 'args': `chrome ${ this.options.testFolder.value }` };

        return stringify(ymlObject);
    }
}

