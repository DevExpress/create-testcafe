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
    .then(() => options.runWizard.value ? runWizard(options) : null)
    .then(() => options.validateAll())
    .then(() => new TemplateGenerator(options, reporter))
    .then(generator => generator.run())
    .catch(err => {
        reporter.error(err);

        // eslint-disable-next-line no-process-exit
        process.exit(1);
        //throw err;
    });
