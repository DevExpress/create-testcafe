import yargs from 'yargs/yargs';
import { Dictionary } from '../interfaces';
import { Options } from 'yargs';

const OPTIONS: Dictionary<Options> = {
    template:      { type: 'string', require: false },
    testFolder:    { type: 'string', require: false },
    silent:        { type: 'boolean', require: false, alias: 's' },
    runNpmInstall: { type: 'boolean', require: false },
};

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
    //TODO: Refactor to chain options assigment call
    return Promise.resolve()
        .then(() => yargs(process.argv.slice(2)).options(OPTIONS).argv)
        .then(r => prepareArgs(r));
}
