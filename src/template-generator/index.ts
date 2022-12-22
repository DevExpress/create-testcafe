import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import InitOptions from '../options/init-options';
import updatePackageJson from './update-package-json';
import createConfig from './create-config';
import Reporter from '../reporter';
import { createGithubWorkflow } from './create-github-workflow';
import { ACTIONS } from '../reporter/actions';

const NPM_INSTALL_COMMAND  = `npm install`;
const DEFAULT_TESTS_PATH   = 'tests';
const TEMPLATES_SRC_FOLDER = path.join(__dirname, '..', 'templates');

export default class TemplateGenerator {
    private readonly initOptions: InitOptions;
    private readonly reporter: Reporter;

    constructor (options: InitOptions, reporter: Reporter) {
        this.initOptions = options;
        this.reporter    = reporter;
    }

    async run (): Promise<void> {
        this.reporter.reportTemplateInitStarted(this.initOptions);

        await this._copyTemplateFiles();
        await this._createConfigFile();
        await this._updatePackageJson();

        if (this.initOptions.createGithubWorkflow)
            await this._createGitHubWorkflow();

        if (this.initOptions.runNpmInstall)
            await this._runNpmInstall();

        this.reporter.reportTemplateInitSuccess(this.initOptions);
    }

    private _runCommand (command: string): Buffer {
        return execSync(command, { stdio: 'inherit' });
    }

    private async _copyTemplateFiles (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.copyTemplate);

        const srcFolderPath = path.join(TEMPLATES_SRC_FOLDER, this.initOptions.template as string);
        let srcPaths        = await fs.promises.readdir(srcFolderPath);

        srcPaths = this._resolveConflicts(srcPaths);

        let distPaths = this._patchTestFolderPaths(srcPaths);

        srcPaths  = srcPaths.map(p => path.join(srcFolderPath, p));
        distPaths = distPaths.map(p => path.join(this.initOptions.rootPath, p));

        for (let i = 0; i < srcPaths.length; i++)
            await fs.promises.cp(srcPaths[i], distPaths[i], { recursive: true });
    }

    private _updatePackageJson (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.updatePackageJson);

        return updatePackageJson(this.initOptions);
    }

    private _createConfigFile (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.createConfig);

        return createConfig(this.initOptions);
    }

    private _resolveConflicts (paths: string[]): string[] {
        if (fs.existsSync(path.join(this.initOptions.rootPath, 'package.json')))
            return paths.filter(p => p !== 'package.json');

        return paths;
    }

    private _patchTestFolderPaths (paths: string[]): string[] {
        return paths.map(p => p === DEFAULT_TESTS_PATH ? this.initOptions.testFolder : p);
    }

    private _runNpmInstall (): void {
        this.reporter.reportActionStarted(ACTIONS.runNpmInstall);

        const appPath = path.relative(process.cwd(), this.initOptions.rootPath);
        const command = `cd ${ appPath } && ${ NPM_INSTALL_COMMAND }`;

        this._runCommand(command);
    }

    private async _createGitHubWorkflow (): Promise<void> {
        this.reporter.reportActionStarted(ACTIONS.createGithubWorkflow);

        return createGithubWorkflow(this.initOptions);
    }
}

