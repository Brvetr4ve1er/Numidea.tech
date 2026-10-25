/**
 * Content-Security-Policy violations in a Playwright page, from every frame:
 * the binding and the init script reach each frame as it is created, so an
 * embed, a lazily loaded player or a dialog's content is counted like the
 * top document. Call it before the first goto.
 *
 * Shared by the two browser gates that hold the proof that the policy blocks
 * nothing the site does: audit.mjs (every page loaded and scrolled, the
 * WorkspaceHQ trailer, walkthrough and booted console, the CV panel, the
 * phone menu, and on the throttled phone the FAQ, estimator, currency and
 * language switches) and keys.mjs (the theme menu, the contact form
 * submitted empty, malformed and valid, the lead store's POST with its switch
 * on, hub's lightbox, scene/'s viewer and the embeds, all driven from the
 * keyboard). Each fails a run on any violation.
 *
 *   await watchCsp(page, (frameUrl, what) => list.push(frameUrl + ': ' + what));
 *
 * `what` is the violated directive, the blocked URI, and the source file and
 * line when the browser gives them.
 */
export async function watchCsp(page, push) {
  await page.exposeBinding('__cspViolation', (src, what) => push(src.frame.url(), what));
  await page.addInitScript(() => addEventListener('securitypolicyviolation', (e) => {
    try {
      window.__cspViolation(e.violatedDirective + ' ' + (e.blockedURI || '?')
        + (e.sourceFile ? ' (' + e.sourceFile.split('/').pop().split('?')[0] + ':' + e.lineNumber + ')' : ''));
    } catch { /* the binding is gone: the page is closing */ }
  }, true));
}
