import yargs from 'yargs';
import { Dictionary } from '../interfaces';
import InitOptions, { INIT_OPTIONS_NAMES } from '../options/init-options';
import path from 'path';

function prepareArgs (args: Dictionary<any>): Dictionary<any> {
    const result: Dictionary<any> = {};
    const appPath                 = args._?.[0] || '.';

    result.rootPath = path.resolve(process.cwd(), appPath);

    for (const key in args) {
        if (key in INIT_OPTIONS_NAMES)
            result[key] = args[key];
    }

    return result;
}


export default function setRunArgs (options: InitOptions): Promise<void> {
    return Promise.resolve().then(() => yargs(process.argv.slice(2))
        .option(INIT_OPTIONS_NAMES.template, { type: 'string', require: false })
        .option(INIT_OPTIONS_NAMES.testFolder, { type: 'string', require: false })
        .option(INIT_OPTIONS_NAMES.runWizard, { type: 'boolean', require: false, alias: 'w' })
        .option(INIT_OPTIONS_NAMES.githubActionsInit, { type: 'boolean', require: false })
        .option(INIT_OPTIONS_NAMES.includeExampleTest, { type: 'boolean', require: false })
        .strictOptions(true)
        .fail((msg, err) => {
            if (err)
                throw err;

            throw new Error(msg);
        })
        .argv,
    )
        .then(args => prepareArgs(args))
        .then(args => options.merge(args));
}
