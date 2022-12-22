import InitOptions from '../options/init-options';
// @ts-ignore
import OS from 'os-family';
import path from 'path';
import { Dictionary } from '../interfaces';
import * as fs from 'fs';

function generateConfigContent (opts: Dictionary<any>): string {
    return `module.exports = ${ JSON.stringify(opts) }`;
}

export default async function createConfig (initOptions: InitOptions): Promise<void> {
    const browsers = OS.mac ? 'safari' : 'chrome';
    const src      = initOptions.testFolder;

    let configName = '.testcaferc.js';

    while (fs.existsSync(path.join(initOptions.rootPath, configName)))
        configName = `.last.${ configName.substring(1) }`;

    const configContent = generateConfigContent({ browsers, src });
    const configPath    = path.join(initOptions.rootPath, configName);

    await fs.promises.writeFile(configPath, configContent);

    initOptions.merge({ configFileName: configName });
}
