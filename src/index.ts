import * as program from 'commander';

import { runTest, runSuite, suites } from './command/run'
import { init } from './command/init';
import { create } from './command/create';

program
    .command('init')
    .description('Create default unit test config file')
    .option('-f, --force', 'Overwrite existing config file, if present.')
    .option('-s, --skip', 'Use defaults only and skip the option prompts.')
    .action(init);

program
    .command('test [testName]')
    .description('Runs a configured test')
    .option('-u, --userProfiles <profiles>', 
            'The list of user profiles to run this test as, the test will loop over the user profiles',
            function (val) { return val.split(',')})
    .action(runTest);

program
    .command('suite [testSuite]')
    .description('Runs a configured test suite')
    .option('-u, --userProfiles <profiles>', 
            'The list of user profiles to run this test as, the test will loop over the user profiles',
            function (val) { return val.split(',')})
    .action(runSuite);

program
    .command('suites')
    .description('List the configured test suites')
    .action(suites);

program
    .command('create [name] [description]')
    .description('Creates a specified test or test suite')
    .option('-s, --suite', 'Creates a suite with the specified name and description')
    .option('-t, --test', 'Creates a new test with the specified name and description')
    .action(create);

program
    .version('1.0.0')
    .parse(process.argv);