module.exports = {
    clearMocks:       true,
    coverageProvider: 'v8',
    testMatch:        [
        '**/test/**/*-test.js',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
    ],
};
