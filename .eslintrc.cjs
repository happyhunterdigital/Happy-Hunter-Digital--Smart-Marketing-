module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react-refresh"],
  rules: {
    "react-refresh/only-export-components": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "no-unused-vars": "off",
    "prefer-const": "off",
    "react-hooks/exhaustive-deps": "off",
    "no-undef": "off",
  },
  ignorePatterns: [
    "dist/**",
    "functions/**",
    "node_modules/**",
    "postcss.config.js",
    "tailwind.config.js",
    "vite.config.ts",
  ],
};
