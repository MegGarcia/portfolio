/**
 * Portfolio password gate — server-side check (Google Apps Script web app).
 *
 * The password is compared HERE, on Google's servers, against a PRIVATE Google
 * Sheet. Only { ok: true, company } or { ok: false } is sent back to the browser,
 * so the passwords themselves are never exposed to visitors or the public repo.
 *
 * ── Sheet setup ───────────────────────────────────────────────────────────
 * In the bound spreadsheet, a tab named "Passwords" with a header row, then one
 * row per company:
 *     A: Company          B: Password        C: Active
 *     Acme Corp           acme-2026          TRUE          (blank Active = active)
 *     Globex              globex-xyz         TRUE
 *     Old Pitch (expired) something          FALSE
 *
 * ── Deploy ────────────────────────────────────────────────────────────────
 * 1. Extensions ▸ Apps Script, paste this file, Save.
 * 2. Deploy ▸ New deployment ▸ type "Web app".
 *       Execute as:      Me
 *       Who has access:  Anyone
 * 3. Authorize when prompted. Copy the Web app URL (ends in /exec).
 * 4. Paste that URL into GATE_ENDPOINT in protected/index.html.
 * (Re-deploy as a NEW version after editing this script; the /exec URL stays the same
 *  if you choose "Manage deployments" ▸ edit ▸ new version.)
 */

function doPost(e) {
  var result = { ok: false };
  try {
    var payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    var pw = String(payload.password || '').trim();
    if (pw) {
      var sheet = SpreadsheetApp.getActive().getSheetByName('Passwords');
      var rows = sheet.getDataRange().getValues();
      for (var i = 1; i < rows.length; i++) {           // skip the header row
        var company = String(rows[i][0] || '').trim();
        var pass = String(rows[i][1] || '').trim();
        var active = rows[i][2];
        var isActive = (active === '' || active === true || String(active).toUpperCase() === 'TRUE');
        if (pass && pw === pass && isActive) {
          result = { ok: true, company: company };
          logAccess_(company);
          break;
        }
      }
    }
  } catch (err) {
    result = { ok: false, error: 'bad_request' };
  }
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, error: 'use_post' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Append a row to a "Log" tab so you can see which company unlocked, and when. */
function logAccess_(company) {
  try {
    var ss = SpreadsheetApp.getActive();
    var log = ss.getSheetByName('Log') || ss.insertSheet('Log');
    if (log.getLastRow() === 0) log.appendRow(['Timestamp', 'Company']);
    log.appendRow([new Date(), company]);
  } catch (e) {}
}
