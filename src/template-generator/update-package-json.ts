import InitOptions from '../options/init-options';
import PackageJson from '@npmcli/package-json';

const TEST_SCRIPT = 'testcafe';

function getEmptyTestScriptName (pkgJson: PackageJson): string {
    if (!pkgJson.content.scripts?.test)
        return 'test';

    return 'testcafe';
}

export default async function updatePackageJson (options: InitOptions): Promise<void> {
    const pkgJson        = await PackageJson.load(options.rootPath);
    const testScriptName = getEmptyTestScriptName(pkgJson);

    await pkgJson.update({
        dependencies:    pkgJson.content.dependencies,
        devDependencies: {
            ...pkgJson.content.devDependencies,
            'testcafe': '*',
        },
        scripts: {
            ...pkgJson.content.scripts,
            [testScriptName]: TEST_SCRIPT,
        },
    });

    options.merge({ testScriptName });

    await pkgJson.save();
}
