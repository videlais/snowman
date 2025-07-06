import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import pluginJest from "eslint-plugin-jest";

// Add jQuery as a global variable
const jquery = { globals: { $: false, jQuery: false } };

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"], plugins: { js, jest: pluginJest }, extends: ["js/recommended"] },
  { files: ["**/*.{js,mjs,cjs}"], languageOptions: { globals: {...globals.browser, ...globals.node, ...pluginJest.environments.globals.globals, ...jquery.globals} } },
  { files: ["**/*.json"], plugins: { json }, language: "json/json", extends: ["json/recommended"] },
]);
