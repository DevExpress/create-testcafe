import yargs from 'yargs';
import { Dictionary } from '../interfaces';
import { OPTIONS } from './options';

function prepareArgs (args: Dictionary<any>): Dictionary<any> {
    const result: Dictionary<any> = {};
    const appPath                 = args._?.[0];

    if (appPath)
        result.appPath = appPath;

    for (const key in args) {
        if (key in OPTIONS)
            result[key] = args[key];
    }

    return result;
}


export default function getRunArgs (): Promise<Dictionary<any>> {
    //TODO: Throw error if unknown arg is used
    return Promise.resolve().then(() => yargs(process.argv.slice(2))
        .option(OPTIONS.template, { type: 'string', require: false })
        .option(OPTIONS.testFolder, { type: 'string', require: false })
        .option(OPTIONS.silent, { type: 'boolean', require: false, alias: 's' })
        .option(OPTIONS.runNpmInstall, { type: 'boolean', require: false })
        .argv,
    ).then(args => prepareArgs(args));
}
