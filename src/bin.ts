#!/usr/bin/env node

import TemplateGenerator from './template-generator';
import getEnvironmentOptions from './options/environment-options';
import InitOptions from './options/init-options';
import getRunArgs from './options/cli-parser';
import runWizard from './wizard';
import Reporter from './reporter';

const options  = new InitOptions();
const reporter = new Reporter();

Promise.resolve()
    .then(() => getRunArgs())
    .then(opts => options.merge(opts))
    .then(() => getEnvironmentOptions(options))
    .then(args => options.merge(args))
    .then(() => !options.silent ? runWizard(options) : {})
    .then(opts => options.merge(opts))
    .then(() => new TemplateGenerator(options, reporter))
    .then(generator => generator.run())
    .then(() => reporter.log(`Success! Run "npm run ${ options.testScriptName }" to start example tests`))
    .catch(err => reporter.error(err));


