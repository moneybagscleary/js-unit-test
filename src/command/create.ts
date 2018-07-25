import chalk from 'chalk';

import { Config, Test, TestSuite } from '../utility/config';
import * as util from '../utility/utility';

export function create(name: string, description: string, cmd: any): void {
    let config: Config = util.getConfig();

    let type = cmd.suite ? 'suite' : cmd.test ? 'test' : null;

    if (!type) {
        console.error('Create type must be defined, specify either test (-t, --test) or suite (-s, --suite)');
        return;
    }

    if (name == undefined) {
        console.error('A name must be defined for creation to occur.');
        return;
    }
    
    console.log(`Created ${chalk.blueBright(type)} named ${chalk.blueBright(name)} `)

    return;
}