import InitOptions from '../options/init-options';
import PackageJson from '@npmcli/package-json';

const TEST_SCRIPT = 'testcafe';

function getEmptyTestScriptName (pkgJson: PackageJson): string {
    if (!pkgJson.content.scripts?.test)
        return 'test';

    return 'testcafe';
}

function buildArgsString (options: InitOptions): string {
    if (options.configFileName !== '.testcaferc.js')
        return ` --config-file ${ options.configFileName }`;

    return '';
}

export default async function updatePackageJson (options: InitOptions): Promise<void> {
    const pkgJson             = await PackageJson.load(options.rootPath);
    const testScriptName      = getEmptyTestScriptName(pkgJson);
    const testScriptArguments = buildArgsString(options);
    const testScript          = `${ TEST_SCRIPT }${ testScriptArguments }`;

    await pkgJson.update({
        dependencies:    pkgJson.content.dependencies,
        devDependencies: {
            ...pkgJson.content.devDependencies,
            'testcafe': '*',
        },
        scripts: {
            ...pkgJson.content.scripts,
            [testScriptName]: testScript,
        },
    });

    await pkgJson.save();

    options.merge({ testScriptName });
}
