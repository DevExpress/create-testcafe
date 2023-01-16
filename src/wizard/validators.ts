import InitOptions from '../options/init-options';

export function testsFolderValidator (initOptions: InitOptions) {
    return function (val: string) {
        try {
            // If testcafe config already exists, user most likely has testcafe tests
            return !!initOptions.tcConfigType.value || initOptions.ensureTestsFolderValid(val);
        }
        catch (err) {
            if (err instanceof Error)
                return err.message;

            return false;
        }
    };
}
