// Plain script (not Babel) — must run before any src/*.jsx that touches
// window.sb. The publishable/anon key is safe to ship client-side; every
// table is RLS-gated server-side.
(function () {
  var SUPABASE_URL = "https://mqcooqzmplarggpjaaoi.supabase.co";
  var SUPABASE_ANON_KEY = "sb_publishable_SU-yr0r2Ue3KkaxxTmq9Sw_vDddNJSu";
  if (!window.supabase || !window.supabase.createClient) {
    console.error("Supabase client library failed to load — check the CDN <script> tag.");
    return;
  }
  window.sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
})();
