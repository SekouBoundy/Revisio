module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-native/all",
    "prettier"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native"],
  env: {
    "react-native/react-native": true,
    node: true,
    jest: true
  },
  rules: {
    // Example overrides
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "react-hooks/exhaustive-deps": "error",
    // …other team-specific adjustments
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};
