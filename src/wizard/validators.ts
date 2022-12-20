import ensureTestsFolderValid from '../options/validate-tests-folder';
import InitOptions from '../options/init-options';

export function testsFolderValidator (initOptions: InitOptions) {
    return function (val: string) {
        try {
            ensureTestsFolderValid(val, initOptions.rootPath);

            return true;
        }
        catch (err) {
            if (err instanceof Error)
                return err.message;

            return false;
        }
    };
}
