import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

console.log("🚀 Starting Hostinger deployment package preparation...");

const standaloneDir = path.join(rootDir, ".next", "standalone");
const staticDir = path.join(rootDir, ".next", "static");
const publicDir = path.join(rootDir, "public");

// 1. Check if .next/standalone exists
if (!fs.existsSync(standaloneDir)) {
  console.error("❌ Error: .next/standalone not found! Please run 'npm run build' first.");
  process.exit(1);
}

// 2. Target paths
const targetStaticDir = path.join(standaloneDir, ".next", "static");
const targetPublicDir = path.join(standaloneDir, "public");

// Helper recursive copy function
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 3. Copy public folder
console.log("📦 Copying public/ -> .next/standalone/public...");
copyRecursive(publicDir, targetPublicDir);

// 4. Copy .next/static folder
console.log("📦 Copying .next/static/ -> .next/standalone/.next/static...");
copyRecursive(staticDir, targetStaticDir);

// 5. Update package.json in standalone to set "start": "node server.js"
const standalonePkgPath = path.join(standaloneDir, "package.json");
if (fs.existsSync(standalonePkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(standalonePkgPath, "utf-8"));
    pkg.scripts = {
      ...pkg.scripts,
      start: "node server.js",
    };
    fs.writeFileSync(standalonePkgPath, JSON.stringify(pkg, null, 2));
    console.log("✅ Updated standalone package.json start script to 'node server.js'.");
  } catch (err) {
    console.warn("⚠️ Could not update package.json:", err.message);
  }
}

// 6. Copy .env.example into standalone as .env.example
const envExamplePath = path.join(rootDir, ".env.example");
const targetEnvPath = path.join(standaloneDir, ".env.example");
if (fs.existsSync(envExamplePath)) {
  fs.copyFileSync(envExamplePath, targetEnvPath);
}

// 7. Create a clean hostinger-deploy folder
const deployOutputDir = path.join(rootDir, "hostinger-deploy");
if (fs.existsSync(deployOutputDir)) {
  fs.rmSync(deployOutputDir, { recursive: true, force: true });
}
console.log("📁 Copying all standalone files to hostinger-deploy/ folder...");
copyRecursive(standaloneDir, deployOutputDir);

// 8. Create ZIP archive for easy 1-click upload to Hostinger
console.log("🗜️ Creating hostinger-deploy.zip for Hostinger File Manager...");
const zipFile = path.join(rootDir, "hostinger-deploy.zip");
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

try {
  // Use powershell Compress-Archive on Windows
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${deployOutputDir}\\*' -DestinationPath '${zipFile}' -Force"`, {
    stdio: "inherit",
  });
  console.log(`✅ Success! Created: ${zipFile}`);
} catch (err) {
  console.warn("⚠️ Could not create ZIP automatically:", err.message);
  console.log("You can still zip the 'hostinger-deploy' folder manually.");
}

console.log("\n🎉 Hostinger deployment bundle is ready!");
console.log("1. Upload 'hostinger-deploy.zip' directly to Hostinger public_html.");
console.log("2. Extract the zip in public_html.");
console.log("3. In Hostinger hPanel -> Node.js, set startup file to 'server.js'.");
