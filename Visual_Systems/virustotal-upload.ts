import * as fs from "fs";
import * as path from "path";

/**
 * ANARCHI VIRUSTOTAL UPLOADER
 * Automates file submission for organic reputation building.
 */
async function uploadToVirusTotal() {
  const apiKey = process.env.VT_API_KEY;
  const exePath = path.join(process.cwd(), "bin", "anarchi-visual-engine.exe");

  if (!apiKey) {
    console.error("\n[VT ERROR] Missing VT_API_KEY environment variable.");
    console.log("Get one for free at: https://www.virustotal.com/gui/my-apikey\n");
    process.exit(1);
  }

  if (!fs.existsSync(exePath)) {
    console.error(`\n[VT ERROR] Executable not found at: ${exePath}`);
    console.log("Run 'npm run package' first to generate the build.\n");
    process.exit(1);
  }

  console.log(`\n[VIRUSTOTAL] Preparing upload for: ${path.basename(exePath)}`);
  
  const fileBuffer = fs.readFileSync(exePath);
  const blob = new Blob([fileBuffer]);
  const formData = new FormData();
  formData.append("file", blob, path.basename(exePath));

  try {
    const response = await fetch("https://www.virustotal.com/api/v3/files", {
      method: "POST",
      headers: {
        "x-apikey": apiKey
      },
      body: formData
    });

    const result = await response.json() as any;

    if (response.ok) {
      const analysisId = result.data.id;
      console.log(`[SUCCESS] Submission complete.`);
      console.log(`[ANALYSIS ID] ${analysisId}`);
      console.log(`[VIEW REPORT] https://www.virustotal.com/gui/file-analysis/${analysisId}/detection\n`);
    } else {
      console.error(`[VT ERROR] ${result.error?.message || "Unknown API error"}`);
    }
  } catch (error: any) {
    console.error(`[FATAL] Failed to connect to VirusTotal: ${error.message}`);
  }
}

uploadToVirusTotal();