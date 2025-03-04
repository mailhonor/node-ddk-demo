const fs = require('fs');
const path = require('path')
import { defineConfig } from 'vite';
import electron from 'vite-plugin-electron/simple';
import electronRenderer from "vite-plugin-electron-renderer";
import polyfillExports from "vite-plugin-electron-renderer";

export default defineConfig({
    plugins: [
        electron({
            main: {
                entry: ["./src/main/main.ts"],
            },
            preload: {
                input: path.join(__dirname, './src/main/preload.ts'),
            },
            renderer: {},
        }),
        electronRenderer(),
        polyfillExports(),
    ],
    server: {
        host: true,
        port: 3000,
    },
    publicDir: 'public',
    css: {
    },
    build: {
        emptyOutDir: false,
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: './index.html',
            },
            output: {
                manualChunks: undefined,
            },
        },
    },
    base: './',
});
