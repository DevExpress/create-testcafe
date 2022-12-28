import { PackageManager } from './index';

export default class PNPM implements PackageManager {
    installDevDependency (name: string): string {
        return `pnpm add --save-dev ${ name }`;
    }

    installGlobally (name: string): string {
        return `pnpm add -g ${ name }`;
    }
}
