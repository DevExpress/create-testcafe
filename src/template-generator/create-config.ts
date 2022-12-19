import InitOptions from '../options/init-options';
// @ts-ignore
import OS from 'os-family';
import path from 'path';
import { Dictionary } from '../interfaces';
import * as fs from 'fs';

const CONFIG_NAME = '.testcaferc.js';

function generateConfigContent (opts: Dictionary<any>): string {
    return `module.exports = ${ JSON.stringify(opts) }`;
}

export default async function createConfig (initOptions: InitOptions): Promise<void> {
    const configPath = path.join(initOptions.rootPath, CONFIG_NAME);
    const browsers   = OS.mac ? 'safari' : 'chrome';
    const src        = initOptions.testsFolder;

    if (fs.existsSync(configPath))
        throw new Error('Testcafe config already exists');

    const configContent = generateConfigContent({ browsers, src });

    await fs.promises.writeFile(configPath, configContent);
}
