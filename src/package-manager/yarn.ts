import { PackageManager } from './index';

export default class Yarn implements PackageManager {
    installDevDependency (name: string): string {
        return `yarn add --dev ${ name }`;
    }

    installGlobally (name: string): string {
        return `yarn global add ${ name }`;
    }
}
