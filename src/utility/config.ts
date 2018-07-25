export interface Test {
    testName?: string;
    jsFilePath?: string;
}

export interface Suite {
    suiteName?: string;
    tests?: string[];
}

export interface Config {
    projectName?: string;
    testUrl?: string;
    suites?: Suite[];
    tests?: Test[];
}