module.exports = {
    preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
    testMatch: [
        // default matchers
        "**/tests/unit/**/*.spec.[jt]s?(x)", "**/__tests__/*.[jt]s?(x)",
        // custom matcher to allow for tests to live in the src/ directory
        "**/(*.)+spec.[jt]s?(x)"
    ],
}
