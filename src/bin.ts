#!/usr/bin/env node

import TemplateGenerator from './template-generator';
import getEnvironmentOptions from './options/environment-options';
import { InitOptions } from './options/init-options';
import getRunArgs from './options/cli-parser';
import runWizard from './wizard';

const options = new InitOptions();

Promise.resolve()
    .then(() => getEnvironmentOptions())
    .then(opts => options.merge(opts))
    .then(() => getRunArgs())
    .then(args => options.merge(args))
    .then(() => !options.silent ? runWizard(options) : {})
    .then(opts => options.merge(opts))
    .then(() => new TemplateGenerator(options))
    .then(generator => generator.run())
    .then(() => console.log(`Success! Run "npm run ${ options.testScriptName }" to start example tests`))
    .catch(err => console.log(err));


