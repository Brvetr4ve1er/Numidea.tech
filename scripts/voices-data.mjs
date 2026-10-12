/**
 * Client voices: what clients say about the work, published only when it is
 * real and consented. Empty until the owner adds one; while empty, nothing
 * renders anywhere (no heading, no placeholder).
 *
 * Each entry:
 *   client       'bordjsteel' | 'alliance' | 'almaflow' | 'nomara' (a delivered
 *                client; the Glaive demo and the studio's own WorkspaceHQ can
 *                never carry a voice)
 *   lang         'fr' | 'en' | 'ar': the language the client said it in. The
 *                quote is shown in that language on every version of the page,
 *                never translated or edited beyond typos.
 *   quote        the client's words, at most 280 characters
 *   name, role   the person and their role, as they agreed to be named
 *                (name may be '' if they asked for the role only)
 *   consentDate  'YYYY-MM-DD' the client agreed to this exact text being
 *                published on the site
 *   consentRef   where that agreement is kept (e.g. 'email 2026-10-20')
 *
 * Then: npm run build (index.html #work and the client's project sheet).
 */
export const VOICES = [];

export const VOICE_CLIENTS = {
  bordjsteel: 'Bordj Steel', alliance: 'Alliance Travel', almaflow: 'AlmaFlowClim', nomara: 'Nomara Voyages',
};

/* every reason an entry cannot be published, as readable strings */
export function validate(list = VOICES, today = new Date().toISOString().slice(0, 10)) {
  const errs = [];
  list.forEach((v, i) => {
    const at = `voice #${i + 1}${v && v.client ? ` (${v.client})` : ''}`;
    if (!v || typeof v !== 'object') { errs.push(`${at}: not an object`); return; }
    if (!(v.client in VOICE_CLIENTS)) errs.push(`${at}: client must be one of ${Object.keys(VOICE_CLIENTS).join(', ')}`);
    if (!['fr', 'en', 'ar'].includes(v.lang)) errs.push(`${at}: lang must be fr, en or ar`);
    if (typeof v.quote !== 'string' || !v.quote.trim()) errs.push(`${at}: quote is empty`);
    else if (v.quote.length > 280) errs.push(`${at}: quote is ${v.quote.length} characters (max 280)`);
    if (typeof v.name !== 'string') errs.push(`${at}: name must be a string ('' for role only)`);
    if (typeof v.role !== 'string' || !v.role.trim()) errs.push(`${at}: role is empty`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(v.consentDate || '') || v.consentDate > today) errs.push(`${at}: consentDate must be a past YYYY-MM-DD`);
    if (typeof v.consentRef !== 'string' || !v.consentRef.trim()) errs.push(`${at}: consentRef must say where the consent is kept`);
  });
  return errs;
}
