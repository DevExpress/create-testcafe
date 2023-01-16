const {
    describe,
    it,
    expect,
}          = require('@jest/globals');
const path = require('path');

const { OPTION_NAMES, default: InitOptions } = require('../../dist/options/init-options');
const {
    addExistingProjectFiles,
    removeTempDirs,
    TEMP_DIR_PATH,
}                                            = require('../utils');
const Option                                 = require('../../dist/options/option').default;

describe('Options tests', function () {
    it(`Should throw error if INIT_OPTIONS_NAMES values do not match keys`, async () => {
        const keys   = Object.keys(OPTION_NAMES);
        const values = Object.values(OPTION_NAMES);

        expect(keys).toEqual(values);
    });

    it(`Should throw error if InitOptions option names do not match the INIT_OPTIONS_NAMES const`, async () => {
        const initOptions      = new InitOptions();
        const initOptionsNames = Object.values(OPTION_NAMES);
        const options          = Object.entries(initOptions).filter(([, value]) => value instanceof Option).map(([key]) => key);

        expect(options).toEqual(initOptionsNames);
    });

    it('Should pass testFolder validation if testcafe config exists', function () {
        const testFolder = 'custom';

        addExistingProjectFiles('', [path.join(testFolder, 'custom.js')]);

        const options = new InitOptions({
            rootPath:     TEMP_DIR_PATH,
            tcConfigType: 'js',
        });

        expect(options.ensureTestsFolderValid(testFolder)).toEqual(true);

        removeTempDirs();
    });
});
