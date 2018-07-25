import chalk from 'chalk';
import Table = require('cli-table');

import { Config, Test, TestSuite } from '../utility/config';
import * as util from '../utility/utility';

export function suites(): void {
    const config: Config = util.getConfig();
    const placeholder: string = 'n/a';
  
    const table: Table = new Table({
      head: ['Name', 'Number of tests']
    });
  
    if (config.testSuites) {
        config.testSuites.forEach(suite => {
            let number = suite.tests ? suite.tests.length : 0;
            table.push([
                suite.testSuiteName || placeholder,
                number
            ]);
        });
    }
  
    console.log(table.toString());
  }

export function runTest(testName: string) {
    const config: Config = util.getConfig();

    if (config.testSuites != undefined && config.testSuites.length == 0) {
        console.error('No test suites are configured.')
        return;
    }

    console.log(`Running ${chalk.green(testName)} against ${config.testUrl}`);

    if (config.testSuites) {
        config.testSuites.forEach(suite => {
            if (suite.tests) {
                suite.tests
                .filter(x => x.testName == testName)
                .forEach(test => {
                    _run(test);
                });
            }
        });
    }

}

export function runSuite(testSuite: string) {
    const config: Config = util.getConfig();

    let testSuites: TestSuite[] = [];

    if (config.testSuites) {
        testSuites = config.testSuites.filter(x=>x.testSuiteName == testSuite);
    }

    if (!testSuites || testSuites.length == 0) {
        console.error('No test suites are configured.')
        return;
    }

    console.log(`Running ${chalk.green(testSuite)} against ${config.testUrl}`);

    testSuites.forEach(suite => {
        if (suite.tests) {
            suite.tests.forEach(test => {
                _run(test);
            })
        }
    });
}

function _run(test: Test) {
    console.log(test.testName);
    console.log(test.jsFilePath);
}