import yargs from 'yargs/yargs';
import { Dictionary } from '../interfaces';
import { Options } from 'yargs';

const OPTIONS: Dictionary<Options> = {
    template:    { type: 'string', require: false },
    testsFolder: { type: 'string', require: false },
    silent:      { type: 'boolean', require: false, alias: 's' },
};

function prepareArgs (args: Dictionary<any>): Dictionary<any> {
    const result: Dictionary<any> = {};

    for (const key in args) {
        if (key in OPTIONS)
            result[key] = args[key];
    }

    return result;
}


export default function getRunArgs (): Promise<Dictionary<any>> {
    //TODO: Throw error if unknown arg is used
    return Promise.resolve()
        .then(() => yargs(process.argv.slice(2)).options(OPTIONS).argv)
        .then(r => prepareArgs(r));
}
