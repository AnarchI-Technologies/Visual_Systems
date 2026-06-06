"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process");
const main_1 = require("./main");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path.join(__dirname, "public")));
// API: Get available themes
app.get("/api/themes", (req, res) => {
    const isPackaged = process.pkg !== undefined;
    const themesPath = isPackaged
        ? path.join(__dirname, "../../src/core/library/themes.json")
        : path.join(__dirname, "src", "core", "library", "themes.json");
    if (fs.existsSync(themesPath)) {
        res.json(JSON.parse(fs.readFileSync(themesPath, "utf-8")));
    }
    else {
        res.status(404).send("Theme bank not found. Run generate-themes first.");
    }
});
// API: Trigger Build
app.post("/api/build", (req, res) => {
    const { dropName, themeId, intensity, tier } = req.body;
    console.log(`[GUI] Triggering build: ${dropName} (${themeId})`);
    (0, main_1.runBuild)(dropName, themeId, intensity, "GUI", tier)
        .then(result => {
        res.json({ success: true, log: `Build Successful: ${result.manifestId}` });
    })
        .catch(err => {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    });
});
app.listen(port, () => {
    const url = `http://localhost:${port}`;
    console.log(`\n[ANARCHI GUI] Dashboard active at ${url}`);
    // Automatically open the user's browser based on Platform
    const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    (0, child_process_1.exec)(`${start} ${url}`);
});
//# sourceMappingURL=server.js.map