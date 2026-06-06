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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeLibrary = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class ThemeLibrary {
    themes;
    constructor() {
        const themesPath = path.join(__dirname, "themes.json");
        if (fs.existsSync(themesPath)) {
            try {
                const data = fs.readFileSync(themesPath, "utf-8");
                this.themes = JSON.parse(data);
            }
            catch (e) {
                console.error("Failed to parse themes.json, initializing empty library.");
                this.themes = [];
            }
        }
        else {
            this.themes = [];
        }
    }
    addTheme(theme) {
        this.themes.push(theme);
    }
    getApprovedThemes() {
        return this.themes.filter(theme => theme.approved);
    }
    getThemeById(id) {
        return this.themes.find(theme => theme.id === id);
    }
}
exports.ThemeLibrary = ThemeLibrary;
//# sourceMappingURL=themeLibrary.js.map