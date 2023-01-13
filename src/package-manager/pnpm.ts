import { PackageManager } from './index';

export default class PNPM implements PackageManager {
    installDevDependency (name: string): string {
        return `pnpm add --save-dev ${ name }`;
    }

    installAllDependencies (): string {
        return `pnpm install`;
    }

    runTestcafeCommand = 'pnpm dlx';
}
