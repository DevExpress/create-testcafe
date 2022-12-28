module.exports = {
    clearMocks:       true,
    coverageProvider: 'v8',
    testMatch:        [
        '**/test/**/*.[jt]s?(x)',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
    ],
};
