import { PackageManager } from './index';

export default class NPM implements PackageManager {
    installDevDependency (name: string): string {
        return `npm install --save-dev ${ name }`;
    }

    installGlobally (name: string): string {
        return `npm install -g ${ name }`;
    }
}
