import { PackageManager } from './index';

export default class NPM implements PackageManager {
    installDevDependency (name: string): string {
        return `npm install --save-dev ${ name }`;
    }

    installAllDependencies (): string {
        return `npm install`;
    }

    npxCommand = 'npx';
}
