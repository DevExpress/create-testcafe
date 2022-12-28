import Yarn from './yarn';
import PNPM from './pnpm';
import NPM from './npm';

export interface PackageManager {
    installDevDependency (name: string): string;

    installGlobally (name: string): string;
}


function determinePackageManager (): PackageManager {
    if (!process.env.npm_config_user_agent)
        return new NPM();

    if (process.env.npm_config_user_agent.includes('yarn'))
        return new Yarn();

    if (process.env.npm_config_user_agent.includes('pnpm'))
        return new PNPM();

    return new NPM();
}

export const packageManager = determinePackageManager();
