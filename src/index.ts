import * as program from 'commander';

import { init } from './command/init';

program
    .command('init')
    .description('Create default unit test config file')
    .option('-f, --force', 'Overwrite existing config file, if present.')
    .option('-s, --skip', 'Use defaults only and skip the option prompts.')
    .action(init);

