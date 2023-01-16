import InitOptions from '../options/init-options';

export function testsFolderValidator (initOptions: InitOptions) {
    return function (val: string) {
        try {
            return initOptions.ensureTestsFolderValid(val);
        }
        catch (err) {
            if (err instanceof Error)
                return err.message;

            return false;
        }
    };
}
