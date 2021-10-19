module.exports = {
    testEnvironment: 'node',
    testMatch: ['<rootDir>/tests/**/*.test.js'],
    // testMatch: ['<rootDir>/tests/**/exercises.get.test.js'],
    maxWorkers: '50%',
    slowTestThreshold: 10,
    collectCoverage: true,
}