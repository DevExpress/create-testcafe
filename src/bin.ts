#!/usr/bin/env node

import TemplateGenerator from './template-generator';
import setEnvironmentOptions from './options/environment-options';
import InitOptions from './options/init-options';
import setCliOptions from './cli/cli-parser';
import runWizard from './wizard';
import Reporter from './reporter';

const options  = new InitOptions();
const reporter = new Reporter();

Promise.resolve()
    .then(() => setCliOptions(options))
    .then(() => setEnvironmentOptions(options))
    .then(() => !options.silent ? runWizard(options) : null)
    .then(() => new TemplateGenerator(options, reporter))
    .then(generator => generator.run())
    .then(() => reporter.log(`Success! Run "npm run ${ options.testScriptName }" to start example tests`))
    .catch(err => reporter.error(err));
