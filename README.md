# jsTestify

Simple cli for running JQuery / Javascript Unit tests on a web site.  Utilizes the Puppeteer library for testing in Chromium browser.  See 

# Installation
```bash
npm install -g js-testify
```

# Usage
`js-testify` runs javascript tests using the Mocha, Chai and Puppeteer libraries.  It allows simple creation of unit test files that can run individually or as suites.

```bash
jsTestify --help
```

## Init
This will ask you a bunch of questions, and then write a config file for you.

```bash
jsTestify init
```
Options:
- `-f` or `--force` will overwrite an existing config file, if present.
- `-s` or `--skip` will use defaults and not prompt you for any options.

## Suites
List all available suites and the number of tests associated which are specified in the configuration file.

```bash
jsTestify suites
```

## Run Test
Run a specified test name.

```bash
jsTestify test [testName]
```

## Run Suite
Run a specified test suite.

```bash
jsTestify suite [suiteName]
```

# Config Options
Configuration options are stored in a `jsTestify.json` file.

```js
{
  "projectName": "Test Project", //The name of the project
  "rootTestPath": "tests", //directory where tests are stored
  "testUrl": "http://www.google.com", //the url of the page to run the tests against
  "puppeteerOpts": {}, //puppeteer options
  "tests": [], //array of test objects, includes name, description and path to js file for test
  "suites": [] //array of suite
}
```

# Development
For easy development, clone the repo and run the following commands in the `js-unit-test` directory:

```bash
npm install
npm link
npm run build
```