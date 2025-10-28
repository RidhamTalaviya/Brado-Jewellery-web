// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default js.defineConfig({
  // Ignore build artifacts
  ignores: ["dist", "build", "node_modules"],

  // Target only JavaScript + JSX files
  files: ["**/*.{js,jsx}"],

  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    globals: globals.browser,
  },

  plugins: {
    react,
    "react-hooks": reactHooks,
    "react-refresh": reactRefresh,
  },

  rules: {
    // React plugin rules
    "react/jsx-uses-vars": "error",
    "react/react-in-jsx-scope": "off", // React 17+ new JSX transform
    "react/prop-types": "warn", // check props for plain JS projects

    // React Hooks rules
    ...reactHooks.configs.recommended.rules,

    // React Refresh rule
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],

    // JS linting extras
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-console": ["warn", { allow: ["warn", "error"] }],
  },

  settings: {
    react: {
      version: "detect",
    },
  },
});
