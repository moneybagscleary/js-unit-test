import chalk from 'chalk';
import Table = require('cli-table');

import { Config, Test, Suite } from '../utility/config';
import * as util from '../utility/utility';

export function suites(): void {
    const config: Config = util.getConfig();
    const placeholder: string = 'n/a';
  
    const table: Table = new Table({
      head: ['Name', 'Number of tests']
    });
  
    if (config.suites) {
        config.suites.forEach(suite => {
            let number = suite.tests ? suite.tests.length : 0;
            table.push([
                suite.suiteName || placeholder,
                number
            ]);
        });
    }
  
    console.log(table.toString());
  }

export function runTest(testName: string) {
    const config: Config = util.getConfig();
    if (!config.tests || config.tests.length == 0) {
        console.error('No tests are configured.')
        return;
    }

    console.log(`Running test ${chalk.green(testName)} against ${config.testUrl}`);

    let test = config.tests.find(x => x.testName == testName);
    if (test) {
        _run(test);
    } else {
        console.log('Could not find the test ' + testName + '.');
    }

}

export function runSuite(suiteName: string) {
    const config: Config = util.getConfig();

    let suites: Suite[] = [];

    if (config.suites) {
        suites = config.suites.filter(x=>x.suiteName == suiteName);
    }

    if (!suites || suites.length == 0) {
        console.error('No test suites are configured.')
        return;
    }

    console.log(`Running suite ${chalk.green(suiteName)} against ${config.testUrl}`);

    suites.forEach(suite => {
        if (suite.tests) {
            suite.tests.forEach(testName => {
                let test = config.tests.find(x => x.testName == testName);
                if (test) {
                    _run(test);
                }
            })
        }
    });
}

function _run(test: Test) {
    console.log(test.testName);
    console.log(test.jsFilePath);
}