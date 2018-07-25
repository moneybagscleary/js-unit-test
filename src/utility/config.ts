export interface Test {
    testName?: string;
    jsFilePath?: string;
}

export interface TestSuite {
    testSuiteName?: string;
    tests?: Test[];
}

export interface Config {
    projectName?: string;
    testUrl?: string;
    testSuites?: TestSuite[];
}