"use strict";
/**
 * ANARCHI PARTS BIN
 * Deterministic options for theme compilation.
 * Refactored for dynamic UI loading.
 */
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
exports.BEHAVIOR_CSS_MAP = exports.PARTS_BIN = void 0;
exports.compileThemeId = compileThemeId;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const binPath = path.join(__dirname, "partsBin.data.json");
let binData = {};
try {
    if (fs.existsSync(binPath)) {
        binData = JSON.parse(fs.readFileSync(binPath, "utf-8"));
    }
}
catch (e) {
    console.error("[ERROR] Failed to load partsBin.data.json, using industrial fallbacks.");
}
exports.PARTS_BIN = {
    accents: binData.accents || [
        "signal_cyan", "toxic_green", "ember_red", "industrial_orange", "tactical_blue", "void_black", "ghost_white", "neon_violet", "oxide_yellow", "cobalt_strike",
        "gamma_green", "infrared", "ultramarine", "phosphorus", "xenon_blue", "krypton_green", "mercury_silver", "lead_grey", "ash_grey", "slate_blue",
        "charcoal_matte", "midnight_navy", "deep_sea_teal", "forest_hazard", "blood_orange", "gold_leaf", "copper_wire", "brass_shell", "iron_sight", "steel_plate",
        "chrome_finish", "silver_lining", "platinum_link", "bronze_age", "clay_earth", "sand_storm", "dust_bowl", "smoke_screen", "fog_bank", "mist_shroud",
        "frost_bite", "ice_core", "flame_burst", "spark_ignite", "bolt_action", "surge_voltage", "current_flow", "resistance_ohm", "capacitance_farad", "inductance_henry",
        "frequency_hertz", "amplitude_peak", "phase_shift", "wave_form", "pulse_width", "beam_focus", "ray_trace", "laser_sight", "plasma_burn", "fusion_cell",
        "fission_rod", "core_meltdown", "mantel_heat", "crust_cool", "magma_flow", "lava_lamp", "obsidian_shard", "quartz_crystal", "ruby_glint", "emerald_haze",
        "sapphire_depth", "amethyst_glow", "topaz_shine", "onyx_black", "pearl_sheen", "opal_fire", "diamond_cut", "carbon_fiber", "silicon_wafer", "germanium_lens",
        "arsenic_poison", "antimony_metal", "bismuth_irid", "polonium_decay", "astatine_rare", "radon_gas", "francium_alkali", "radium_glow", "actinium_lume", "thorium_react",
        "protactinium_heavy", "uranium_depleted", "neptunium_trans", "plutonium_grade", "americium_smoke", "curium_alpha", "berkelium_beta", "californium_gamma", "einsteinium_flux", "fermium_mass"
    ],
    textures: binData.textures || [
        "concrete_spray", "brushed_steel", "digital_static", "carbon_fiber", "anodized_aluminum", "corrugated_iron", "weathered_tarpaulin", "oxidized_copper", "ballistic_nylon", "tempered_glass",
        "grimy_plexiglass", "rusted_girder", "oily_asphalt", "cracked_pavement", "distressed_leather", "reinforced_concrete", "perforated_metal", "expanded_mesh", "diamond_plate", "sandblasted_zinc",
        "etched_brass", "cast_iron", "machined_magnesium", "powder_coated_rail", "galvanized_bucket", "hammered_pewter", "brushed_nickel", "satin_titanium", "bead_blasted_poly", "thermal_wrap",
        "kevlar_weave", "ripstop_fabric", "mylar_foil", "silicone_rubber", "vulcanized_tread", "polycarbonate_shell", "acrylic_tint", "epoxy_resin", "fiberglass_matte", "asbestos_tile",
        "slate_shingle", "granite_slab", "marble_vein", "basalt_pillar", "obsidian_flow", "pumice_stone", "clay_brick", "ceramic_glaze", "porcelain_white", "terracotta_pot",
        "scanline_overlay", "chromatic_fuzz", "vhs_tracking", "crt_phosphor", "pixel_grid", "halftone_dot", "stipple_noise", "dither_pattern", "bayer_matrix", "glitch_streak",
        "data_moshing", "macroblock_noise", "compression_artifact", "interlaced_field", "raster_line", "vector_contour", "wireframe_mesh", "polygon_shard", "voxel_cloud", "point_render",
        "circuit_trace", "solder_mask", "silkscreen_print", "copper_pour", "via_drill", "thermal_pad", "flux_residue", "liquid_cooling", "heatsink_fin", "fan_blade",
        "bio_hazard", "chemical_spill", "toxic_waste", "radioactive_dust", "biological_growth", "fungal_spore", "moss_patch", "lichen_crust", "algae_bloom", "rust_bloom",
        "oil_slick", "water_bead", "frost_crystal", "snow_drift", "mud_splatter", "blood_spray", "ink_blot", "paint_drip", "charcoal_smudge", "ash_fall"
    ],
    behaviors: binData.behaviors || [
        "brace_frame", "minimal_hud", "overflow_glitch", "split_signal", "ghost_echo", "mirror_edge", "radial_sweep", "linear_scan", "pulse_rhythm", "sync_lock",
        "desync_drift", "frame_rupture", "border_bleed", "corner_pinch", "center_out", "top_down_wipe", "bottom_up_fill", "left_right_pan", "zoom_punch", "spin_cycle",
        "glitch_stutter", "flicker_lamp", "neon_buzz", "signal_drop", "noise_gate", "data_leak", "buffer_stale", "latency_lag", "ping_bounce", "packet_loss",
        "header_corruption", "checksum_fail", "parity_error", "bit_flip", "nibble_swap", "byte_reverse", "word_align", "segment_fault", "stack_overflow", "null_pointer",
        "brace_corner", "brace_bracket", "brace_parenthesis", "brace_chevron", "brace_angle", "brace_square", "brace_curly", "brace_pipe", "brace_slash", "brace_dash",
        "hud_compass", "hud_crosshair", "hud_bar_graph", "hud_ticker", "hud_timer", "hud_coords", "hud_velocity", "hud_altitude", "hud_bearing", "hud_status",
        "scan_line_fast", "scan_line_slow", "scan_line_erratic", "scan_line_double", "scan_line_triple", "scan_line_thick", "scan_line_thin", "scan_line_dotted", "scan_line_dashed", "scan_line_inverse",
        "glitch_rgb_split", "glitch_uv_offset", "glitch_shutter", "glitch_shear", "glitch_skew", "glitch_scale", "glitch_rotation", "glitch_opacity", "glitch_contrast", "glitch_saturation",
        "motion_drift_x", "motion_drift_y", "motion_drift_xy", "motion_jitter", "motion_sway", "motion_float", "motion_sink", "motion_rebound", "motion_orbit", "motion_zigzag",
        "layout_stack", "layout_grid", "layout_column", "layout_row", "layout_overlap", "layout_inset", "layout_outset", "layout_floating", "layout_pinned", "layout_docked"
    ],
    vocabularies: binData.vocabularies || {
        industrial: ["corroded", "hardened", "signal loss", "reinforced", "heavy-duty"],
        neon: ["overclocked", "vibrant", "saturated", "luminescent", "fluorescent"],
        toxic: ["hazardous", "unstable", "leaking", "volatile", "reactive"],
        signal: ["degraded", "interrupted", "ghosting", "interference", "static"],
        tactical: ["encrypted", "stealth", "covert", "classified", "redacted"]
    }
};
function compileThemeId(parts) {
    return `THEME_${parts.accentIdx}${parts.textureIdx}${parts.behaviorIdx}`;
}
exports.BEHAVIOR_CSS_MAP = binData.behavior_css || {
    "pulse_rhythm": "@keyframes pulse { 0% { opacity: 0.7; transform: scale(0.98); } 50% { opacity: 1; transform: scale(1); } 100% { opacity: 0.7; transform: scale(0.98); } }\n    .behavior-layer { animation: pulse var(--engine-speed) infinite ease-in-out; }",
    "ghost_echo": "@keyframes ghost { 0% { text-shadow: 0 0 0 transparent; } 50% { text-shadow: 4px 0 2px var(--accent-color); opacity: 0.6; } 100% { text-shadow: 0 0 0 transparent; } }\n    .glyph { animation: ghost 4s infinite linear; }",
    "overflow_glitch": "@keyframes glitch { 0% { clip-path: inset(0 0 0 0); } 20% { clip-path: inset(10% 0 40% 0); } 40% { clip-path: inset(80% 0 5% 0); } 100% { clip-path: inset(0 0 0 0); } }\n    body::after { content: \"\"; position: absolute; inset: 0; background: inherit; animation: glitch 0.2s infinite; opacity: 0.1; pointer-events: none; }",
    "brace_frame": ".glyph::before { content: \"[ \"; opacity: 0.5; }\n    .glyph::after { content: \" ]\"; opacity: 0.5; }"
};
//# sourceMappingURL=partsBin.js.map