export interface Test {
    testName?: string;
    testDescription?: string;
    jsFilePath?: string;
}

export interface Suite {
    suiteName?: string;
    suiteDescription?: string;
    tests?: string[];
}

export interface TestResults {
    createTestResults?: boolean;
    onlyFailedTests?: boolean;
    testResultsPath?: string;
}

export interface Config {
    projectName?: string;
    testUrl?: string;
    rootTestPath: string;
    testResults?: TestResults
    puppeteerOpts?: any
    suites?: Suite[];
    tests?: Test[];
}