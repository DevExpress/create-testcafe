import yargs from 'yargs';
import { Dictionary } from '../interfaces';
import { OPTION_NAMES } from './option-names';
import InitOptions from '../options/init-options';

function prepareArgs (args: Dictionary<any>): Dictionary<any> {
    const result: Dictionary<any> = {};
    const appPath                 = args._?.[0];

    if (appPath)
        result.appPath = appPath;

    for (const key in args) {
        if (key in OPTION_NAMES)
            result[key] = args[key];
    }

    return result;
}


export default function setRunArgs (initOptions: InitOptions): Promise<void> {
    //TODO: Throw error if unknown arg is used
    return Promise.resolve().then(() => yargs(process.argv.slice(2))
        .option(OPTION_NAMES.template, { type: 'string', require: false })
        .option(OPTION_NAMES.testFolder, { type: 'string', require: false })
        .option(OPTION_NAMES.silent, { type: 'boolean', require: false, alias: 's' })
        .option(OPTION_NAMES.createGithubWorkflow, { type: 'boolean', require: false })
        .option(OPTION_NAMES.runNpmInstall, { type: 'boolean', require: false })
        .argv,
    )
        .then(args => prepareArgs(args))
        .then(args => initOptions.merge(args));
}
