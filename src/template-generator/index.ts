import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import InitOptions from '../options/init-options';
import updatePackageJson from './update-package-json';
import createConfig from './create-config';
import Reporter from '../reporter';
import { MESSAGES } from '../reporter/messages';

const TMP_DIR_NAME        = 'testcafe_init_tmp';
const CLONE_REPO_COMMAND  = `git clone --depth 1 https://github.com/Artem-Babich/testcafe-templates ${ TMP_DIR_NAME }`;
const NPM_INSTALL_COMMAND = `npm install`;
const DEFAULT_TESTS_PATH  = 'tests';

export default class TemplateGenerator {
    private readonly initOptions: InitOptions;
    private readonly reporter: Reporter;

    constructor (options: InitOptions, reporter: Reporter) {
        this.initOptions = options;
        this.reporter    = reporter;

        this.initOptions.setUnsetOptionsToDefaults();
        this.initOptions.validateAll();
    }

    async run (): Promise<void> {
        try {
            await this._cloneRepo();
            await this._copyTemplateFiles();

            if (this.initOptions.projectType)
                await this._updatePackageJson();


            await this._createConfigFile();

            if (this.initOptions.runNpmInstall)
                await this._runNpmInstall();


            await this._removeTmpDir();
        }
        catch (err) {
            await this._removeTmpDir();

            throw err;
        }
    }

    private _runCommand (command: string): Buffer {
        return execSync(command, { stdio: 'inherit' });
    }

    private async _copyTemplateFiles (): Promise<void> {
        this.reporter.log(MESSAGES.copyTemplate);

        const templateFolderPath = path.join(this.initOptions.rootPath, TMP_DIR_NAME, this.initOptions.template);
        let srcPaths             = await fs.promises.readdir(templateFolderPath);

        srcPaths = this._preparePathsForMerging(srcPaths);

        let distPaths = this._patchTestFolderPaths(srcPaths);

        srcPaths  = srcPaths.map(p => path.join(templateFolderPath, p));
        distPaths = distPaths.map(p => path.join(this.initOptions.rootPath, this.initOptions.appPath, p));

        for (let i = 0; i < srcPaths.length; i++)
            await fs.promises.cp(srcPaths[i], distPaths[i], { recursive: true });
    }

    private _updatePackageJson (): Promise<void> {
        this.reporter.log(MESSAGES.updatePackageJson);

        return updatePackageJson(this.initOptions);
    }

    private _createConfigFile (): Promise<void> {
        this.reporter.log(MESSAGES.createConfig);

        return createConfig(this.initOptions);
    }

    private _preparePathsForMerging (paths: string[]): string[] {
        if (this.initOptions.projectType)
            return paths.filter(p => p !== 'package.json');

        return paths;
    }

    private _ensureTmpDirNotExists (): void {
        if (fs.existsSync(TMP_DIR_NAME))
            throw new Error(`Already exists: ${ TMP_DIR_NAME }`);
    }

    private _removeTmpDir (): Promise<void> {
        return fs.promises.rm(TMP_DIR_NAME, { recursive: true });
    }

    private _patchTestFolderPaths (paths: string[]): string[] {
        return paths.map(p => p.replace(DEFAULT_TESTS_PATH, this.initOptions.testFolder));
    }

    private _cloneRepo (): void {
        this.reporter.log(MESSAGES.cloneRepo);

        this._ensureTmpDirNotExists();
        this._runCommand(CLONE_REPO_COMMAND);
    }

    private _runNpmInstall (): void {
        this.reporter.log(MESSAGES.runNpmInstall);

        const command = `cd ${ this.initOptions.appPath } && ${ NPM_INSTALL_COMMAND }`;

        this._runCommand(command);
    }

}

