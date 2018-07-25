import * as fs from 'fs-extra';
import * as inquirer from 'inquirer';

import * as util from '../utility/utility';

interface InitOptions {
    force?: boolean;
    skip?: boolean;
}

export function init(options: InitOptions): void {
    if (fs.existsSync(util.configFile) && !options.force) {
        return console.error('Config file already exists');
    }

    if (options.skip) {
        // skip prompts and create with defaults
        util.setConfig(util.configFile, util.configDefaults);
        return;
    }
    
    const questions: inquirer.Questions = [
        {
            name: 'projectName',
            message: 'Project Name',
            default: (util.configDefaults.projectName || undefined),
        },
        {
            name: 'testUrl',
            message: 'Test Site URL',
            default: (util.configDefaults.testUrl || undefined)
        },
        {
            name: 'rootPath',
            message: 'Tests Root Path',
            default: (util.configDefaults.rootTestPath || undefined)
        }
    ];
    
      // prompt user for config options
    inquirer.prompt(questions).then((answers: inquirer.Answers): void => {    
          util.setConfig(util.configFile, {
            projectName: answers.projectName,
            testUrl: answers.testUrl,
            rootTestPath: answers.rootPath
          });
    });
}