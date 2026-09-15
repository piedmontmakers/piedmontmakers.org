// Shared destinations for the 10th Street practice field, used by both
// /facilities (the public-facing section) and /10th-street-check-in (the
// QR-code landing page). Previously duplicated by hand in both pages with a
// comment asking editors to keep them in sync — a single source now makes
// that impossible to get wrong.

export const GUIDELINES =
  "https://docs.google.com/document/d/1RFGhuBCfTaJu7H9k6fkn8T7z_Qch0iOkI7fRHVVGftM/edit?tab=t.zggakcezu7da";
// The waiver used to be a Google Form; it's now a custom page served by the
// same Apps Script web app that runs check-in (same project as CHECKIN
// below, ?page=waiver route).
export const WAIVER =
  "https://script.google.com/a/macros/piedmontmakers.org/s/AKfycbyvQwtTkmCk_P9k3dd3CmrjXh-zDBHaTt93uSC2swZIZbzhNFx8PNKuXhBnufjAUqLheA/exec?page=waiver";
export const CHECKIN =
  "https://script.google.com/a/macros/piedmontmakers.org/s/AKfycbyvQwtTkmCk_P9k3dd3CmrjXh-zDBHaTt93uSC2swZIZbzhNFx8PNKuXhBnufjAUqLheA/exec";
