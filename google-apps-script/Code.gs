/**
 * Google Apps Script Web App backing the portfolio contact form.
 *
 * Setup (see README.md for the full walkthrough):
 *   1. Create a Google Sheet to collect submissions.
 *   2. In that Sheet: Extensions -> Apps Script, and paste this file in.
 *   3. Deploy -> New deployment -> Web app
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Copy the Web app URL and paste it into FORM_ENDPOINT in js/contact.js.
 */

// Where to email a copy of each new message. Leave '' to skip email.
var NOTIFY_EMAIL = 'megangarcia2024@gmail.com';

// Tab the submissions are written to (created automatically if missing).
var SHEET_NAME = 'Contact Submissions';

var HEADER_ROW = ['Timestamp', 'Name', 'Email', 'Message'];

function doPost(e) {
  try {
    var data = parseBody(e);

    // Only handle the contact form; ignore anything else.
    if (data.formType && data.formType !== 'contact') {
      return jsonResponse({ ok: false, error: 'Unsupported form type.' });
    }

    var name = String(data.name || '').trim();
    var email = String(data.email || '').trim();
    var message = String(data.message || '').trim();

    if (!name || !email || !message) {
      return jsonResponse({ ok: false, error: 'Missing required fields.' });
    }

    var sheet = getSheet();
    sheet.appendRow([new Date(), name, email, message]);

    if (NOTIFY_EMAIL) {
      sendNotification(name, email, message);
    }

    return jsonResponse({ ok: true });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

// A GET is handy for confirming the deployment is live in a browser.
function doGet() {
  return jsonResponse({ ok: true, status: 'Contact endpoint is live.' });
}

function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    try {
      return JSON.parse(e.postData.contents);
    } catch (ignore) {
      // Fall through to form-encoded parameters.
    }
  }
  return (e && e.parameter) || {};
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADER_ROW);
    sheet.getRange(1, 1, 1, HEADER_ROW.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function sendNotification(name, email, message) {
  var subject = 'New portfolio message from ' + name;
  var body =
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    'Message:\n' + message;
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    replyTo: email,
    body: body
  });
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
