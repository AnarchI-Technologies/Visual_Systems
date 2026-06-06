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
exports.cleanupWorkspace = cleanupWorkspace;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Workspace Cleanup Tool
 * Moves identified redundant files to a 'delete' folder.
 */
function cleanupWorkspace() {
    const deleteDir = path.join(process.cwd(), "delete");
    const isDryRun = process.argv.includes("--dry-run");
    if (!fs.existsSync(deleteDir)) {
        fs.mkdirSync(deleteDir, { recursive: true });
    }
    const targets = [
        "brand.ts",
        "src/brand.ts",
        "src/core/schema/schema.ts",
        "assetValidator.ts",
        "dropfactory.ts",
        "overlayCompiler.ts"
    ];
    console.log(`\n[CLEANUP] Starting workspace audit${isDryRun ? " (DRY RUN)" : ""}...`);
    targets.forEach(target => {
        const fullPath = path.join(process.cwd(), target);
        if (fs.existsSync(fullPath)) {
            if (isDryRun) {
                console.log(`   [PLAN] Would move: ${target}`);
            }
            else {
                const destination = path.join(deleteDir, `${path.basename(fullPath)}_${Date.now()}`);
                console.log(`   > Moving redundant file to /delete: ${target}`);
                fs.renameSync(fullPath, destination);
            }
        }
    });
    console.log(`[CLEANUP] Workspace optimized.\n`);
}
if (require.main === module) {
    cleanupWorkspace();
}
//# sourceMappingURL=cleanup.js.map