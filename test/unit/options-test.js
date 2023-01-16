const {
    describe,
    it,
    expect,
} = require('@jest/globals');

const { INIT_OPTIONS_NAMES, default: InitOptions } = require('../../dist/options/init-options');
const Option                                       = require('../../dist/options/option').default;

describe('Options tests', function () {
    it(`Should throw error if INIT_OPTIONS_NAMES values do not match keys`, async () => {
        const keys   = Object.keys(INIT_OPTIONS_NAMES);
        const values = Object.values(INIT_OPTIONS_NAMES);

        expect(keys).toEqual(values);
    });

    it(`Should throw error if InitOptions option names do not match the INIT_OPTIONS_NAMES const`, async () => {
        const initOptions      = new InitOptions();
        const initOptionsNames = Object.values(INIT_OPTIONS_NAMES);
        const options          = Object.entries(initOptions).filter(([, value]) => value instanceof Option).map(([key]) => key);

        expect(options).toEqual(initOptionsNames);
    });
});
