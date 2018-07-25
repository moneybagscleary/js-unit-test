import chalk from 'chalk';
import Table = require('cli-table');
import * as fs from 'fs-extra';
import * as path from 'path';
import { EOL } from 'os';

var Mocha = require('mocha');

import { Config, Test, Suite } from '../utility/config';
import * as util from '../utility/utility';

let script;

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
        _createPreScriptSnippet(`Running test ${chalk.green(testName)} against ${config.testUrl}`, config);
        _generateTestScriptSnippet(test, config);
    } else {
        console.log('Could not find the test ' + testName + '.');
    }

    _runTests();
}

export function runSuite(suiteName: string) {
    const config: Config = util.getConfig();

    let suites: Suite[] = [];

    if (config.suites) {
        suites = config.suites.filter(x=>x.suiteName == suiteName);
    }

    if (!suites || suites.length == 0) {
        return console.error('No test suites are configured.');
    }

    console.log(`Running suite ${chalk.green(suiteName)} against ${config.testUrl}`);

    _createPreScriptSnippet(`Running suite ${suiteName} against ${config.testUrl}`, config)

    suites.forEach(suite => {
        if (suite.tests) {
            suite.tests.forEach(testName => {
                let test = config.tests.find(x => x.testName == testName);
                if (test) {
                    _generateTestScriptSnippet(test, config);
                }
            })
        }
    });

    //once the test scripts are generated
    _runTests();
}

function _createPreScriptSnippet(description: string, config: Config) {
    _cleanUpTests();

    var headless = config.showBrowser ? 'false' : 'true';

    script = [
        `const {expect} = require('chai')`,
        `const puppeteer = require('puppeteer')`,
        EOL,
        `describe('${description}', function () {`,
        `// Define global variables`,
        `let browser`,
        `let page`,
        EOL,
        `before(async function () {`,
        `   browser = await puppeteer.launch({headless: ${headless}});`,
        `   page = await browser.newPage();`,
        `   await page.goto('${config.testUrl}');`,
        '})',
        EOL,
        `after(async function () {`,
        `   await page.close()`,
        `   await browser.close()`,
        `})`,
        EOL,
    ].join(EOL);
}

function _createPostScriptSnippet() {
    script = [
        script,
        '});'
    ].join(EOL);
}

function _runTests() {
    _createPostScriptSnippet();

    var mocha = new Mocha({ timeout: 30000 });

    let file: string = path.join(process.cwd(), 'runnableTest/test.js');

    fs.outputFile(file, script, (error: Error) => {
        if (error) {
          return console.error(error);
        }

        mocha.addFile(file);
    
        mocha.run(function(failures) {
            //_cleanUpTests();
            process.exitCode = failures ? -1 : 0;
        });    
    });
}

function _cleanUpTests() {
    let file: string = path.join(process.cwd(), 'runnableTest/test.js');
    let dir: string = path.join(process.cwd(), 'runnableTest')

    if (fs.existsSync(file)) {
        fs.removeSync(file);

        if (fs.ensureDirSync(dir)) {
            fs.rmdirSync(dir);
        }
    }
}

function _generateTestScriptSnippet(test: Test, config: Config) {
    let rootPath: string = path.join(process.cwd(), config.rootTestPath);
    let filePath: string = path.join(rootPath, test.jsFilePath);


    if (test.jsFilePath == undefined || !fs.existsSync(filePath)) {
        return console.error(`No file configured for test: ${chalk.cyanBright(test.testName)} or the file does not exist`);
    }

    let content: string = fs.readFileSync(filePath).toString();

    if (content) {
        _addJStoScript(content, test);
    }

    return;
}

function _addJStoScript(content: string, test: Test) {
    let description = `#${test.testName}`;

    if (test.testDescription) {
        description += ` - ${test.testDescription}`;
    }

    script = [
        script,
        `describe('${description}', function() {`,
        content,
        `});`
    ].join(EOL);
}