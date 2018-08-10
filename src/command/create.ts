import chalk from 'chalk';
import * as fs from 'fs-extra';
import * as _ from 'lodash';

import { Config } from '../utility/config';
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


    if(type == 'test'){
        let fileName = _.camelCase(name);
        let fileSubDirectory = process.cwd() + config.rootTestPath + fileName + ".test.js";
        fs.outputFile(fileSubDirectory, `/*${description}*/`);
        let newTest = {testName: name, testDescription: description, jsFilePath: fileSubDirectory};
        config.tests.push(newTest);
    } else{//suite
        let newSuite = {suiteName: name, suiteDescription: description, tests: []}
        config.suites.push(newSuite);
    }

    util.setConfig(util.configFile, config);

    return;
}