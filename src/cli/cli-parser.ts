import yargs from 'yargs';
import { Dictionary } from '../interfaces';
import { OPTION_NAMES } from './option-names';
import InitOptions from '../options/init-options';
import path from 'path';

function prepareArgs (args: Dictionary<any>): Dictionary<any> {
    const result: Dictionary<any> = {};
    const appPath                 = args._?.[0] || '.';

    result.rootPath = path.resolve(process.cwd(), appPath);

    for (const key in args) {
        if (key in OPTION_NAMES)
            result[key] = args[key];
    }

    return result;
}


export default function setRunArgs (options: InitOptions): Promise<void> {
    //TODO: Throw error if unknown arg is used
    return Promise.resolve().then(() => yargs(process.argv.slice(2))
        .option(OPTION_NAMES.template, { type: 'string', require: false })
        .option(OPTION_NAMES.testFolder, { type: 'string', require: false })
        .option(OPTION_NAMES.runWizard, { type: 'boolean', require: false, alias: 'w' })
        .option(OPTION_NAMES.createGithubWorkflow, { type: 'boolean', require: false })
        .option(OPTION_NAMES.addTests, { type: 'boolean', require: false })
        .argv,
    )
        .then(args => prepareArgs(args))
        .then(args => options.merge(args));
}
