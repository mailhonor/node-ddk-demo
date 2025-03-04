const child_process = require('child_process');
const fs = require("node:fs")

const exec = (cmd) => {
  child_process.execSync(cmd, { stdio: 'inherit' });
}

fs.rmSync("dist", { recursive: true, force: true });
fs.rmSync("dist-electron", { recursive: true, force: true });

fs.copyFileSync("./node_modules/js-web-screen-shot/dist/screenShotPlugin.umd.js", "public/screenShotPlugin.umd.js")

exec("npx vite");