module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  plugins: ["prettier", "@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@typescript-eslint/explicit-function-return-type": "off",
  },

  overrides: [
    {
      files: ["./*.js", "./scripts/**/*.js"],
      env: {
        node: true,
        es2020: true,
      },
      rules: {
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
