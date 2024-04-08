import type {Config} from 'jest';

const config: Config = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [ '/node_modules/' ],
    moduleFileExtensions: [ 'ts', 'tsx', 'js' ],
    transform: { '^.+\\.(ts|tsx)$': 'ts-jest' },
    testMatch: [ '**/tests/*.test.+(ts|tsx|js)' ]
};

export default config;