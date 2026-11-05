/**
 * ZuperVerse - Supabase Cloud Realtime Configuration
 * Project: game-kosakta-multiplayer (Active Supabase Singapore ap-southeast-1)
 */
const ZUPER_SUPABASE_CONFIG = {
    url: "https://vmsmmueseewuxgqtaguf.supabase.co",
    anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtc21tdWVzZWV3dXhncXRhZ3VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4OTA1OTIsImV4cCI6MjEwOTQ2NjU5Mn0.2e7QsvYAFgYnebc4DdlqdXU6O2JFHDMGBCyj4gHqIy8"
};

let zuperSb = null;

try {
    if (window.supabase && typeof window.supabase.createClient === "function") {
        zuperSb = window.supabase.createClient(ZUPER_SUPABASE_CONFIG.url, ZUPER_SUPABASE_CONFIG.anonKey);
        console.log("⚡ ZuperVerse Connected to Supabase Realtime Engine:", ZUPER_SUPABASE_CONFIG.url);
    }
} catch (e) {
    console.warn("Supabase init error:", e);
}

window.zuperSb = zuperSb;
