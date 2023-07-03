module.exports = {
  extends: require.resolve('@umijs/lint/dist/config/eslint'),
  "rules": {
    // Note: you must disable the base rule as it can report incorrect errors
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off"
  }
};
