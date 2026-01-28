import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "eslint-config-next";

const nextConfig = Array.isArray(nextPlugin) ? nextPlugin[0] : nextPlugin;

export default [
    {
        ignores: ["node_modules/", ".next/", "dist/", "build/", ".turbo/", "next-env.d.ts", "eslint.config.mjs"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                // Node.js globals
                global: "readonly",
                process: "readonly",
                Buffer: "readonly",
                // Browser globals
                window: "readonly",
                document: "readonly",
                navigator: "readonly",
                fetch: "readonly",
                console: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly",
                alert: "readonly",
                confirm: "readonly",
                localStorage: "readonly",
                sessionStorage: "readonly",
                location: "readonly",
                history: "readonly",
                // React
                React: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            ...js.configs.recommended.rules,
            ...tsPlugin.configs.recommended.rules,
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "no-undef": "off",
        },
    },
    {
        files: ["next.config.ts", "tailwind.config.ts"],
        languageOptions: {
            globals: {
                process: "readonly",
            },
        },
    },
];
