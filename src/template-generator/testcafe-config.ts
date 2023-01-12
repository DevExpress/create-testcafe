import InitOptions from '../options/init-options';
import path from 'path';
import { Dictionary } from '../interfaces';
import * as fs from 'fs';

//Export for tests
export function generateConfigContent (opts: Dictionary<any>): string {
    return `module.exports = ${ JSON.stringify(opts, null, 4) }`;
}

export default async function createConfig (initOptions: InitOptions): Promise<void> {
    const configPath    = path.join(initOptions.rootPath.value, '.testcaferc.js');
    const src           = initOptions.testFolder.value;
    const configContent = generateConfigContent({ src });

    await fs.promises.writeFile(configPath, configContent, { encoding: 'utf-8' });
}
