import * as fs from "fs";
import * as path from "path";

export interface ThemeDNA {

  id: string;

  name: string;

  description: string;

  accentColor: string;

  corruptionLevel: number;

  textureProfile: string;

  glyphBehavior: string;

  promptVocabulary: string[];

  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';

  approved: boolean;
}

export class ThemeLibrary {

  private themes: ThemeDNA[];

  constructor() {
    const themesPath = path.join(__dirname, "themes.json");
    if (fs.existsSync(themesPath)) {
      try {
        const data = fs.readFileSync(themesPath, "utf-8");
        this.themes = JSON.parse(data);
      } catch (e) {
        console.error("Failed to parse themes.json, initializing empty library.");
        this.themes = [];
      }
    } else {
      this.themes = [];
    }
  }

  addTheme(theme: ThemeDNA) {

    this.themes.push(theme);
  }

  getApprovedThemes() {

    return this.themes.filter(
      theme => theme.approved
    );
  }

  getThemeById(id: string) {

    return this.themes.find(
      theme => theme.id === id
    );
  }
}