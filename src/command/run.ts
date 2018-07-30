import chalk from 'chalk';
import Table = require('cli-table');
import * as fs from 'fs-extra';
import * as path from 'path';
import { EOL } from 'os';
import * as glob from 'glob';

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

export function runTest(testName: string, cmd: any) {
    const config: Config = util.getConfig();
    if (!config.tests || config.tests.length == 0) {
        return console.error('No tests are configured.')
    }

    let profiles = cmd.userProfiles;

    //console.log(`Running test ${chalk.green(testName)} against ${config.testUrl}`);
    let userProfiles = profiles && profiles.length > 0 ? profiles : [""];

    let test = config.tests.find(x => x.testName == testName);
    userProfiles.forEach(function (profile, index) {
        if (test) {
            let profileName = profile ? `using user profile ${chalk.green(profile)}` : '';
            _createPreScriptSnippet(`Running test ${chalk.green(testName)} against ${chalk.green(config.testUrl)} ${profileName}`, config, profile);
            _generateTestScriptSnippet(test, config);
        } else {
            console.log('Could not find the test ' + testName + '.');
        }

        _createTestFile(`test${index}`)
    }); 
    
    _runTests();
}

export function runSuite(suiteName: string, cmd: any) {
    const config: Config = util.getConfig();

    let suites: Suite[] = [];
    let profiles = cmd.userProfiles;

    if (config.suites) {
        suites = config.suites.filter(x=>x.suiteName == suiteName);
    }

    if (!suites || suites.length == 0) {
        return console.error('No test suites are configured.');
    }

    //console.log(`Running suite ${chalk.green(suiteName)} against ${config.testUrl}`);
    let userProfiles = profiles && profiles.length > 0 ? profiles : [""];
    userProfiles.forEach(function (profile, index) {
        let profileName = profile ? `using user profile ${chalk.green(profile)}` : '';
        _createPreScriptSnippet(`Running suite ${chalk.green(suiteName)} against ${chalk.green(config.testUrl)} ${profileName}`, config, profile);

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

        _createTestFile(`test${index}`)
    });

    _runTests();
}

function _createPreScriptSnippet(description: string, config: Config, profileID: string) {
    var puppeteerOpts = config.puppeteerOpts ? JSON.stringify(config.puppeteerOpts) : '{}'

    let pageObjects = _getAllPageObjectFiles(config);

    let userProfile = _getUserProfile(profileID, config);

    script = [
        `const {expect} = require('chai')`,
        `const puppeteer = require('puppeteer')`,
        EOL,
        `describe('${description}', function () {`,
        `// Define global variables`,
        `let browser`,
        `let page`,
        `let userProfile = ${userProfile}`,
        `${pageObjects}`,
        `before(async function () {`,
        `   browser = await puppeteer.launch(${puppeteerOpts});`,
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

function _getUserProfile(profileID: string, config: Config): string {
    var value = "{}";

    let profile = config.userProfiles.find(x => x.id == profileID);

    if (profile) {
        value = JSON.stringify(profile.value);
    }

    return value;
}

function _getAllPageObjectFiles(config: Config): string  {
    let returnValue = '';
    let fileContent = '';

    let files = glob.sync(`${config.rootTestPath}/**/*.pageObject.js`, {
        root: path.join(process.cwd(), config.rootTestPath)
    });

    if (files) {
        files.forEach(function(file) {
            fileContent = fs.readFileSync(file).toString();
            returnValue = [
                returnValue,
                fileContent
            ].join(EOL);
        });
    }

    return returnValue;
}

function _createPostScriptSnippet() {
    script = [
        script,
        '});'
    ].join(EOL);
}

function _createTestFile(fileName: string) {
    _createPostScriptSnippet();

    let file: string = path.join(process.cwd(), `runnableTest/${fileName}.js`);

    fs.outputFileSync(file, script);
}

function _runTests() {
    var mocha = new Mocha({ timeout: 30000 });

    let files = glob.sync("/*.js", {
        root: path.join(process.cwd(), 'runnableTest')
    });

    if (files) {
        files.forEach(function (file){
            mocha.addFile(file);
        });    

        mocha.run(function(failures) {
            _cleanUpTests();
            process.exitCode = failures ? -1 : 0;
        });    
    }
}

function _cleanUpTests() {
    let files = glob.sync("/*.js", {
        root: path.join(process.cwd(), 'runnableTest')
    });

    if (files) {
        files.forEach(function (file) {
            if (fs.existsSync(file)) {
                fs.removeSync(file);
            }
        });
    }

    let dir: string = path.join(process.cwd(), 'runnableTest')

    if (fs.ensureDirSync(dir)) {
        fs.rmdirSync(dir);
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