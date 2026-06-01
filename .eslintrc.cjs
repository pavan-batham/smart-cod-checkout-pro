/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "prettier",
  ],
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off",
    "prefer-const": "error",
  },
  ignorePatterns: ["node_modules/", "build/", "public/build/"],
};
