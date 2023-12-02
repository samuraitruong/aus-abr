/* eslint-env node */
module.exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  ignorePatterns: "*.js",
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": ["warn"],
  },
};
