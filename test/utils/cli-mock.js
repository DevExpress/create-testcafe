#!/usr/bin/env node

const Option      = require('../../dist/options/option').default;
const InitOptions = require('../../dist/options/init-options').default;
const cliParser   = require('../../dist/cli/cli-parser').default;
const options     = new InitOptions();

Promise.resolve()
    .then(() => cliParser(options))
    .then(() => Object.entries(options).map(([key, value]) => {
        if (value instanceof Option)
            process.stdout.write(`${ key }=${ value }\n`);
    }));
