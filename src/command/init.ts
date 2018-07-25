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
        util.setConfig(util.configFile, { projectName: 'default' });
        return;
    }
    
    const questions: inquirer.Questions = [
        {
            name: 'projectName',
            message: 'Project Name',
            default: ('default' || undefined),
        },
        {
            name: 'testUrl',
            message: 'Test Site URL',
            default: ('localhost:4010' || undefined)
        }
    ];
    
      // prompt user for config options
    inquirer.prompt(questions).then((answers: inquirer.Answers): void => {    
          util.setConfig(util.configFile, {
            projectName: answers.projectName,
            testUrl: answers.testUrl
          });
    });
}