import * as program from 'commander';

import { runTest, runSuite, suites } from './command/run'
import { init } from './command/init';

program
    .command('init')
    .description('Create default unit test config file')
    .option('-f, --force', 'Overwrite existing config file, if present.')
    .option('-s, --skip', 'Use defaults only and skip the option prompts.')
    .action(init);

program
    .command('test [testName]')
    .description('Runs a configured test')
    .action(runTest);

program
    .command('suite [testSuite]')
    .description('Runs a configured test suite')
    .action(runSuite);

program
    .command('suites')
    .description('List the configured test suites')
    .action(suites);

program
    .version('1.0.0')
    .parse(process.argv);