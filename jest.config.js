module.exports = {
    clearMocks:       true,
    coverageProvider: 'v8',
    testMatch:        [
        '**/test/**/cli-test.js',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
    ],
};
