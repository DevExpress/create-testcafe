import yargs from 'yargs';
import { Dictionary } from '../interfaces';
import InitOptions, { OPTION_NAMES } from '../options/init-options';
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

function camelToKebab (propName: string): string {
    return propName.replace(/[A-Z]/g, letter => `-${ letter.toLowerCase() }`);
}

export default function setCliOptions (options: InitOptions, processArgs = process.argv.slice(2)): Promise<void> {
    return Promise.resolve().then(() => yargs(processArgs)
        .usage('Usage: create-testcafe <appPath> [options]')
        .describe('help', 'Display the help menu')
        .describe('version', 'Display the version number')
        .option(camelToKebab(OPTION_NAMES.template), {
            type:     'string',
            require:  false,
            describe: 'Project template: javascript/typescript',
        })
        .option(camelToKebab(OPTION_NAMES.testFolder), {
            type:     'string',
            require:  false,
            describe: 'Test subfolder path',
        })
        .option(camelToKebab(OPTION_NAMES.runWizard), {
            type:     'boolean',
            require:  false,
            describe: 'Launch the interactive wizard',
            alias:    'w',
        })
        .option(camelToKebab(OPTION_NAMES.githubActionsInit), {
            type:     'boolean',
            require:  false,
            describe: 'Add a GitHub Actions workflow file',
        })
        .option(camelToKebab(OPTION_NAMES.includeSampleTests), {
            type:     'boolean',
            require:  false,
            describe: 'Add sample tests',
        })
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
