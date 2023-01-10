import { PackageManager } from './index';

export default class Yarn implements PackageManager {
    installDevDependency (name: string): string {
        return `yarn add --dev ${ name }`;
    }

    installAllDependencies (): string {
        return `yarn`;
    }
}
