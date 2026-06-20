import express from "express";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { runBuild } from "./main";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// API: Get available themes
app.get("/api/themes", (req, res) => {
  const isPackaged = (process as any).pkg !== undefined;
  const themesPath = isPackaged
    ? path.join(__dirname, "../../src/core/library/themes.json")
    : path.join(__dirname, "src", "core", "library", "themes.json");

  if (fs.existsSync(themesPath)) {
    res.json(JSON.parse(fs.readFileSync(themesPath, "utf-8")));
  } else {
    res.status(404).send("Theme bank not found. Run generate-themes first.");
  }
});

// API: Trigger Build
app.post("/api/build", (req, res) => {
  const { dropName, themeId, intensity, tier } = req.body;
  
  console.log(`[GUI] Triggering build: ${dropName} (${themeId})`);
  
  runBuild(dropName, themeId, intensity, "GUI", tier)
    .then((result: { manifestId: string }) => {
      res.json({ success: true, log: `Build Successful: ${result.manifestId}` });
    })
    .catch((err: Error) => {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    });
});

app.listen(port, () => {
  const url = `http://localhost:${port}`;
  console.log(`\n[ANARCHI GUI] Dashboard active at ${url}`);

  // Automatically open the user's browser based on Platform
  const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
  exec(`${start} ${url}`);
});
