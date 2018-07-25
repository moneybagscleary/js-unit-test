import deepmerge = require('deepmerge');
import * as fs from 'fs-extra';
import * as path from 'path';

import { Config, Test, Suite } from './config';

/**
 * Config file path.
 */
export const configFile: string = path.join(process.cwd(), 'js-unit-test.json');

/*
 * Get safe file path
 */
export function safeFile(file: string): string {
    return file.replace(/\//g, '_');
}

export const configDefaults: Config = {
    projectName: 'default',
    testUrl: 'localhost:4010',
    rootTestPath: 'tests',
    suites: [],
    tests: []
};

/**
 * Get and parse config file.
 */
export function getConfig(): Config {
    let config: Config;

    config = configDefaults
  
    try {
      config = fs.readJsonSync(configFile);
    } catch (error) {
      console.error('Could not find or parse config file. You can use the `init` command to create one!');
      process.exit();
    }
  
    return deepmerge(configDefaults, config);
 }
  
 /**
  * Write config file with provided object contents.
  *
  * @param file Configuration file to write to.
  * @param config Object to save for config file.
  */
 export function setConfig(file: string, config: Config): void {
    const content: string = JSON.stringify(config, null, 2);
  
    // save file
    fs.outputFile(file, content, (error: Error) => {
      if (error) {
        return console.error(error);
      }
  
      console.log('Config file created!');
    });
 }