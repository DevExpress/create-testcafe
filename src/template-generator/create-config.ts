import InitOptions from '../options/init-options';
import path from 'path';
import { Dictionary } from '../interfaces';
import * as fs from 'fs';

function generateConfigContent (opts: Dictionary<any>): string {
    return `module.exports = ${ JSON.stringify(opts) }`;
}

export default async function createConfig (initOptions: InitOptions): Promise<void> {
    const configPath    = path.join(initOptions.rootPath, '.testcaferc.js');
    const src           = initOptions.testFolder;
    const configContent = generateConfigContent({ src });

    await fs.promises.writeFile(configPath, configContent, { encoding: 'utf-8' });
}
