// WorkspaceHQ v2 — placeholder fixture data (public repo: no real names/paths).
window.HQ_DATA = (function () {
  const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const DOW = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const dayAt = o => new Date(2026, 9, 4 - o);
  const fmtD = d => MON[d.getMonth()] + ' ' + d.getDate();
  const LEVELS = [[1,0,'Drifter'],[2,150,'Tinkerer'],[3,350,'Builder'],[4,600,'Operator'],[5,900,'Foreman'],[6,1300,'Architect'],[7,1800,'Overseer'],[8,2400,'Warden'],[9,3100,'Grandmaster']];
  function levelOf(xp) {
    let i = 0; LEVELS.forEach((L, k) => { if (xp >= L[1]) i = k; });
    const c = LEVELS[i], n = LEVELS[i + 1];
    return { l: c[0], t: c[2], min: c[1], next: n ? n[1] : null, pct: n ? Math.round((xp - c[1]) / (n[1] - c[1]) * 100) : 100, toNext: n ? n[1] - xp : 0 };
  }
  const NAV = [
    { id: 'home', label: 'Home', glyph: '⌂' },
    { id: 'projects', label: 'Projects', glyph: '▦' },
    { id: 'tasks', label: 'Tasks', glyph: '☑' },
    { id: 'automations', label: 'Automations', glyph: '▶' },
    { id: 'claude', label: 'Claude', glyph: '✦' },
    { id: 'history', label: 'History', glyph: '◷' },
    { id: 'system', label: 'System', glyph: '▣' },
    { id: 'life', label: 'Life', glyph: '♥' },
    { id: 'studio', label: 'Studio', glyph: '◉' },
  ];
  const SUBS = {
    projects: [['grid','Grid'],['map','Map'],['archived','Archived']],
    tasks: [['ranked','Ranked'],['byproject','By project'],['ideas','Ideas & risks']],
    automations: [['runnable','Runnable'],['library','Library'],['scheduled','Scheduled']],
    claude: [['sessions','Sessions'],['canvas','Canvas']],
    history: [['trends','Trends'],['timeline','Timeline'],['milestones','Milestones']],
    system: [['machine','Machine'],['clutter','Workspace clutter']],
    life: [['screen','Screen time'],['social','Social'],['notes','Notes']],
  };
  const ST = {
    risk: { label: 'At risk', color: 'var(--red)', tone: 'red', rank: 0 },
    care: { label: 'Needs care', color: 'var(--orange)', tone: 'orange', rank: 1 },
    idle: { label: 'Idle', color: 'var(--blue)', tone: 'blue', rank: 2 },
    ok: { label: 'Healthy', color: 'var(--green)', tone: 'green', rank: 3 },
  };
  const TIER = {
    red: { label: 'Critical', color: 'var(--red)', rank: 0 },
    orange: { label: 'Important', color: 'var(--orange)', rank: 1 },
    yellow: { label: 'Housekeeping', color: 'var(--yellow)', rank: 2 },
  };
  const P0 = [
    { id: 'a', name: 'Project A', stack: ['Next.js','TypeScript','shadcn'], path: '~/dev/project-a', dirty: 12, ahead: 0, behind: 0, secrets: 1, hasGit: true, commits: 148, branch: 'main', canonical: 'main', tests: '14 / 20 passing', build: 'green', pct: 62, activity: 'active', lastDays: 3, lastCommit: 'fix: header layout', loc: 16461, files: 155, dev: 'npm run dev', port: 3000, recent: ['header.tsx','cart.ts','globals.css'], level: 3, pxp: 420, remote: 'origin (other account)' },
    { id: 'b', name: 'Project B', stack: ['Python','Flask','HTMX'], path: '~/dev/project-b', dirty: 26, ahead: 2, behind: 0, secrets: 0, hasGit: true, commits: 61, branch: 'main', canonical: 'main', tests: '4 suites (not counted)', build: 'unknown', pct: 55, activity: 'stale', lastDays: 36, lastCommit: 'feat: phase 4 collector', loc: 31641, files: 212, dev: 'flask run', port: 5000, recent: ['collector.py','test_phase4.py'], level: 2, pxp: 260, remote: 'origin' },
    { id: 'c', name: 'Project C', stack: ['Static HTML','CSS'], path: '~/dev/project-c', dirty: null, ahead: 0, behind: 0, secrets: 0, hasGit: false, commits: 0, branch: '—', canonical: 'main', tests: 'none', build: 'n/a', pct: 48, activity: 'active', lastDays: null, lastCommit: null, loc: 3266, files: 24, dev: null, recent: ['index.html','styles.css'], level: 1, pxp: 60, remote: 'none' },
    { id: 'd', name: 'Project D', stack: ['Node','Express'], path: '~/dev/project-d', dirty: 0, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 93, branch: 'main', canonical: 'main', tests: 'none', build: 'green', pct: 70, activity: 'dormant', lastDays: 71, lastCommit: 'chore: bump deps', loc: 11974, files: 88, dev: 'node server.js', port: 8080, recent: ['server.js'], level: 2, pxp: 190, remote: 'origin' },
    { id: 'e', name: 'Project E', stack: ['Next.js 14','PWA','Supabase'], path: '~/dev/project-e', dirty: 41, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 0, branch: 'main', canonical: 'main', tests: 'none', build: 'unknown', pct: 40, activity: 'active', lastDays: null, lastCommit: null, loc: 11098, files: 97, dev: 'npm run dev', port: 3001, recent: ['layout.tsx','sw.js'], level: 1, pxp: 64, remote: 'none' },
    { id: 'f', name: 'Project F', stack: ['FastAPI','React'], path: '~/dev/project-f', dirty: 3, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 18, branch: 'main', canonical: 'main', tests: 'present', build: 'unknown', pct: 45, activity: 'stale', lastDays: 24, lastCommit: 'wip: scraper queue', loc: 6120, files: 61, dev: 'uvicorn app:app', port: 8000, recent: ['queue.py'], level: 1, pxp: 53, remote: 'origin' },
    { id: 'g', name: 'Project G', stack: ['React','Vite'], path: '~/dev/project-g', dirty: 0, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 212, branch: 'main', canonical: 'main', tests: 'present', build: 'green', pct: 66, activity: 'dormant', lastDays: 112, lastCommit: 'docs: readme', loc: 21736, files: 140, dev: 'npm run dev', port: 5173, recent: ['App.tsx'], level: 2, pxp: 210, remote: 'origin' },
    { id: 'h', name: 'Project H', stack: ['Static','CF Pages'], path: '~/dev/project-h', dirty: 2, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 340, branch: 'refactor-v2', canonical: 'main', tests: 'none', build: 'green', pct: 78, activity: 'active', lastDays: 0, lastCommit: 'refactor: trim sections', loc: 39011, files: 230, dev: 'npx wrangler pages dev', port: 8788, recent: ['index.html','sections.css'], level: 3, pxp: 388, remote: 'origin' },
    { id: 'i', name: 'Project I', stack: ['Go','CLI'], path: '~/dev/project-i', dirty: 0, ahead: 0, behind: 0, secrets: 0, hasGit: true, commits: 44, branch: 'main', canonical: 'main', tests: 'present', build: 'green', pct: 90, activity: 'dormant', lastDays: 204, lastCommit: 'v1.0.0', loc: 2210, files: 19, dev: null, recent: [], level: 1, pxp: 120, remote: 'origin' },
  ];
  const T0 = [
    { id: 't1', tier: 'red', title: 'Rotate the exposed key in Project A', why: '1 secret matched in .env.local — a live breach risk', proj: 'a', age: 2, xp: 100 },
    { id: 't2', tier: 'red', title: 'Commit 12 uncommitted files in Project A', why: '12 files at risk · last commit 3 days ago', proj: 'a', age: 3, xp: 100, commitTask: true },
    { id: 't3', tier: 'red', title: 'Put Project C under version control', why: 'No git repo — zero rollback on 3,266 lines', proj: 'c', age: 7, xp: 100 },
    { id: 't4', tier: 'orange', title: 'Commit 26 files in Project B', why: 'Stale 36 days and drifting uncommitted', proj: 'b', age: 36, xp: 60, commitTask: true },
    { id: 't5', tier: 'orange', title: 'Merge refactor-v2 into main on Project H', why: 'Active branch isn\u2019t the canonical one', proj: 'h', age: 12, xp: 60 },
    { id: 't6', tier: 'yellow', title: 'Make a first commit in Project E', why: 'Repo exists with 0 commits · 41 files never saved', proj: 'e', age: 4, xp: 30, commitTask: true },
    { id: 't7', tier: 'yellow', title: 'Count the phase tests in Project B', why: '4 test files exist but the scanner doesn\u2019t see them', proj: 'b', age: 36, xp: 30 },
  ];
  const IDEAS = [
    { id: 's1', kind: 'risk', title: 'Rotate the 4 keys in Project D .env before any push', proj: 'd', ai: false, effort: 'S', impact: 'high' },
    { id: 's2', kind: 'urgent', title: 'Confirm push rights on Project A — remote belongs to another account', proj: 'a', ai: false, effort: 'S', impact: 'high' },
    { id: 's3', kind: 'idea', title: 'Split the 900-line cart.ts into smaller modules', proj: 'a', ai: true, effort: 'M', impact: 'med' },
    { id: 's4', kind: 'polish', title: 'Add a build-status badge to the README', proj: 'h', ai: true, effort: 'S', impact: 'low' },
    { id: 's5', kind: 'idea', title: 'Purge 1.2 GB of regenerable caches in Project G', proj: 'g', ai: false, effort: 'S', impact: 'med', purge: '1.2 GB' },
  ];
  const KIND = { risk: ['Risk','red'], urgent: ['Urgent','orange'], idea: ['Idea','blue'], polish: ['Polish','default'], task: ['Task','gold'], suggestion: ['Suggestion','default'] };
  const AUTOS = [
    { id: 'scan', icon: '🔮', name: 'Full scan', kind: 'script', mode: 'bg', cmd: 'node collector/run.mjs --full', dir: '~/hq', last: { ok: true, ago: '6h ago' }, quota: true, desc: 'Re-scan every project and rebuild the snapshot.', cat: 'Workspace' },
    { id: 'rebuild', icon: '🧪', name: 'Rebuild data bundle', kind: 'script', mode: 'bg', cmd: 'node scripts/build-data.mjs', dir: '~/hq', last: { ok: true, ago: '6h ago' }, desc: 'Regenerate the renderer bundle from the latest scan.', cat: 'Workspace' },
    { id: 'secret', icon: '🛡️', name: 'Secret sweep', kind: 'mcp', mode: 'bg', cmd: 'hq-mcp secret_sweep --all', dir: '~/hq', last: { ok: false, ago: '2d ago', err: 'timeout after 60s' }, desc: 'Scan every project for exposed credentials.', cat: 'Security' },
    { id: 'weekly', icon: '📜', name: 'Weekly recap', kind: 'chain', mode: 'bg', steps: ['Collect the last 7 scans','Draft the recap with Claude','Write it to Vault A'], cmd: 'chain weekly-recap', dir: '~/hq', quota: true, last: { ok: true, ago: '5d ago' }, desc: 'Summarise the week into a vault note.', cat: 'Writing' },
    { id: 'health', icon: '🩺', name: 'PC health check', kind: 'script', mode: 'bg', cmd: 'pwsh collector/pc-health.ps1', dir: '~/hq', last: { ok: true, ago: '6h ago' }, desc: 'Disk, memory, temps and local AI runtime.', cat: 'Machine' },
    { id: 'backup', icon: '📦', name: 'Snapshot all projects', kind: 'script', mode: 'term', cmd: 'pwsh scripts/snapshot-all.ps1', dir: '~/dev', last: null, desc: 'Filtered backup copy of every tracked project.', cat: 'Workspace' },
    { id: 'pushall', icon: '⇧', name: 'Push all clean repos', kind: 'script', mode: 'term', cmd: 'pwsh scripts/push-clean.ps1', dir: '~/dev', last: { ok: true, ago: '12d ago' }, desc: 'git push for every repo with 0 dirty files.', cat: 'Git', destructive: true },
    { id: 'reveal', icon: '🌀', name: 'Scroll reveal kit', kind: 'skill', mode: 'term', cmd: 'claude /skill scroll-reveal', dir: '(current project)', quota: true, last: null, desc: 'Claude skill: add scroll-reveal animations.', cat: 'Claude skills' },
    { id: 'clean', icon: '🧹', name: 'Clean temp folders', kind: 'script', mode: 'bg', cmd: 'pwsh fix/clean-temp.ps1', dir: '~', last: { ok: true, ago: '20d ago' }, desc: 'Clear OS temp and old snapshot copies.', cat: 'Machine' },
  ];
  const LIBRARY = [['Claude skills', 412, 6], ['Scripts', 188, 14], ['MCP tools', 96, 5], ['Chains', 24, 4], ['Plugins', 160, 0], ['Agents', 100, 0]];
  const SCHEDULED = [
    { name: 'Nightly scan', when: 'Every day · 03:00', next: 'Tonight 03:00', last: 'Today 03:00 · ok' },
    { name: 'PC health check', when: 'Runs inside every scan', next: 'With the next scan', last: 'Today 03:00 · ok' },
    { name: 'Weekly recap', when: 'Sundays · 20:00', next: 'Sun Oct 5 · 20:00', last: 'Sep 28 · ok' },
  ];
  const RUN_OUT = {
    scan: ['Reading config · 8 projects','git status × 8','Secret pass · regex','Counting test suites','Enrichment · Claude CLI (quota)','Writing snapshot 2026-10-04','Rebuilding bundle'],
  };
  const INITIAL_RUNS = [
    { id: 'r1', name: 'Dev server · Project A', kind: 'dev', status: 'running', meta: 'npm run dev · :3000', started: '09:12', out: ['ready - started server on 0.0.0.0:3000', 'compiled /cart in 412ms'] },
    { id: 'r0', name: 'Nightly scan', kind: 'scan', status: 'ok', meta: '03:00 · 2m 14s', started: '03:00', out: RUN_OUT.scan.slice() },
    { id: 'r2', name: 'Secret sweep', kind: 'auto', status: 'failed', meta: 'Oct 2 · timeout after 60s', started: 'Oct 2', out: ['Scanning 8 projects…', 'Project G: 1,204 files…', '✗ timeout after 60s'] },
  ];
  const SESSIONS = [
    { id: 'c1', title: 'Fix the flaky cart test', proj: 'a', status: 'running', started: '10:02', tail: ['> Reading tests/cart.test.ts', '> Found a race in the useCart hook', '> Editing src/hooks/useCart.ts (2 changes)', '> Running npm test -- cart'] },
    { id: 'c2', title: 'Draft a README for Project F', proj: 'f', status: 'done', started: 'Yesterday 17:40', tail: ['> Read 14 files', '> Wrote README.md (82 lines)', '> Done · 3m 10s'] },
    { id: 'c3', title: 'Explain the collector phases', proj: 'b', status: 'failed', started: 'Oct 1', tail: ['> Reading collector.py', '✗ Session ended: quota reached'] },
  ];
  const CANVAS = [
    { id: 'w1', type: 'stat', title: 'Uncommitted by project', value: '38', note: 'A 12 · B 26 · H 2 (from today\u2019s scan)', tone: 'orange', wide: false },
    { id: 'w2', type: 'list', title: 'Things to ship this week', items: ['Project H: merge refactor-v2', 'Project A: rotate key', 'Project C: git init'], tone: 'gold', wide: false },
    { id: 'w3', type: 'note', title: 'Cart race — what I found', body: 'useCart reads the store before hydration finishes. Guarding on `ready` fixes the test without touching the UI.', tone: 'blue', wide: true },
    { id: 'w4', type: 'stat', title: 'Tests passing in Project A', value: '14 / 20', note: 'Up from 11 after this morning\u2019s session', tone: 'green', wide: false },
  ];
  const WEEKS = [
    { w: 'Sep 28 – Oct 4', stats: '+120 xp · 2 tasks · 1 milestone', ev: [['⇧','Pushed Project H · 3 commits','Oct 3','h','green'],['✗','Secret sweep failed · timeout','Oct 2',null,'red'],['★','Milestone: Well documented','Oct 1',null,'gold'],['✓','Done: Remove stray empty folders','Sep 30',null,'green']], quiet: 3 },
    { w: 'Sep 21 – 27', stats: '+260 xp · 4 tasks', ev: [['⇧','Pushed Project A · 6 commits','Sep 26','a','green'],['⭐','Level 4 · Operator','Sep 24',null,'gold'],['＋','New project tracked: Project E','Sep 22','e','blue']], quiet: 4 },
    { w: 'Sep 14 – 20', stats: '+40 xp · 1 task', ev: [['✓','Done: Add a README to Project F','Sep 17','f','green']], quiet: 6 },
  ];
  const ACH = [
    { id: 'liftoff', name: 'Liftoff', icon: '🚀', desc: 'Push a repo to a remote for the first time.', unlocked: true },
    { id: 'documented', name: 'Well documented', icon: '📚', desc: 'Every product has a README.', unlocked: true },
    { id: 'cartographer', name: 'Cartographer', icon: '🗺️', desc: 'Every product has a vault note.', unlocked: true },
    { id: 'control', name: 'Under control', icon: '🔒', desc: 'Every product has git with ≥1 commit.', have: 6, need: 8 },
    { id: 'streak7', name: 'Habit formed', icon: '📈', desc: 'Scan on 7 days in a row.', have: 5, need: 7 },
    { id: 'roll', name: 'On a roll', icon: '🔥', desc: 'Complete 5 tasks.', have: 2, need: 5, dyn: 'done' },
    { id: 'zero', name: 'Inbox zero (code)', icon: '🏆', desc: 'Drive critical tasks to zero.', have: 0, need: 3, dyn: 'red' },
    { id: 'clean', name: 'Clean slate', icon: '🧼', desc: 'Get a repo to zero uncommitted files.', dyn: 'commit' },
    { id: 'safety', name: 'Safety net', icon: '🥅', desc: 'Add a first passing test suite.' },
    { id: 'keys', name: 'No loose keys', icon: '🔑', desc: 'No exposed secrets anywhere.' },
    { id: 'green', name: 'Green machine', icon: '✅', desc: 'Every build green at once.' },
    { id: 'scribe', name: 'Scribe', icon: '✍️', desc: 'Capture 30 learnings.' , have: 11, need: 30 },
  ];
  const ISSUES = [
    { id: 'i1', sev: 'orange', title: 'Disk C: is 91% full', why: 'Scans and snapshots slow down below 10% free.', fix: 'Clean temp folders · frees about 14 GB', cmd: 'pwsh fix/clean-temp.ps1', auto: 'clean' },
    { id: 'i2', sev: 'orange', title: 'Local model runtime is not running', why: 'Commit drafts fall back to Claude, which uses quota.', fix: 'Start the local runtime', cmd: 'ollama serve' },
  ];
  const VITALS = [['CPU','18%','ok'],['Memory','11.2 / 32 GB','ok'],['GPU','54 °C','ok'],['Disk C:','91% full','warn'],['Disk D:','42% full','ok'],['Uptime','3d 4h','ok'],['Network','online','ok'],['Docker','stopped','off']];
  const CLUTTER = [
    { id: 'k1', title: 'Duplicate folders', detail: '3 copies of project-b-old · 2.4 GB', verb: 'Review', danger: false },
    { id: 'k2', title: 'Empty folders', detail: '7 empty folders under ~/dev', verb: 'Remove…', danger: true },
    { id: 'k3', title: 'Reference clones', detail: '10 read-only clones · 3.1 GB', verb: 'Review', danger: false },
    { id: 'k4', title: 'Trivial folders', detail: '2 folders with under 3 files', verb: 'Review', danger: false },
  ];
  const SITES = [['docs.example.com', 100, 'Work'], ['code.example.com', 65, 'Work'], ['video.example.com', 48, 'Distracting'], ['social.example.com', 31, 'Distracting'], ['mail.example.com', 22, 'Work'], ['news.example.com', 14, 'Distracting']];
  const POSTS = [
    { id: 'p1', handle: '@handle-a', text: 'Shipped a calmer dashboard for my side projects. One next action, no noise.', where: 'Social site A', staged: 'Today 09:40' },
    { id: 'p2', handle: '@handle-a', text: 'Small win: every project finally has a README.', where: 'Social site B', staged: 'Yesterday' },
  ];
  const MENTIONS = [
    { who: '@handle-b', text: 'How do you track uncommitted work across repos?', when: '2h ago', reply: true },
    { who: '@handle-c', text: 'Nice screenshots!', when: '5h ago', reply: false },
    { who: '@handle-d', text: 'Is the scanner open source?', when: 'Yesterday', reply: true },
  ];
  const VAULTS = [
    { name: 'Vault A', active: 12, stale: 140, total: 612, sync: 'Task "Rotate key" synced from the app · 09:41' },
    { name: 'Vault B', active: 3, stale: 88, total: 230, sync: 'No changes this week' },
    { name: 'Vault C', active: 0, stale: 41, total: 41, sync: 'Not opened in 30 days' },
  ];
  const LEARN = [['Guard store reads on hydration', 'Project A', 'Oct 3'], ['Flask blueprints need unique names', 'Project B', 'Sep 29'], ['CF Pages ignores _redirects in subfolders', 'Project H', 'Sep 24']];
  const CAPTURES = [
    { id: 'x1', kind: 'snip', name: 'snip-1004-0912.png', day: 'Today', time: '09:12', size: '240 KB' },
    { id: 'x2', kind: 'rec', name: 'rec-1004-0840.webm', day: 'Today', time: '08:40', size: '8.4 MB', dur: '1:12' },
    { id: 'x3', kind: 'snip', name: 'snip-1003-1730.png', day: 'Yesterday', time: '17:30', size: '180 KB' },
    { id: 'x4', kind: 'snip', name: 'snip-1003-1102.png', day: 'Yesterday', time: '11:02', size: '310 KB' },
    { id: 'x5', kind: 'rec', name: 'rec-1001-1515.webm', day: 'Oct 1', time: '15:15', size: '22 MB', dur: '3:40' },
    { id: 'x6', kind: 'snip', name: 'snip-1001-0930.png', day: 'Oct 1', time: '09:30', size: '95 KB' },
  ];
  const HOTKEYS = [['Ctrl Alt G','Show WorkspaceHQ','ok'],['Ctrl Alt X','Quick-run palette','ok'],['Ctrl Alt S','Snip','ok'],['Ctrl Alt R','Record','ok'],['Ctrl Alt L','Mini HUD','conflict'],['Ctrl Alt Shift S','Snip full screen','ok'],['Ctrl Alt Shift R','Record full screen','ok']];
  const KEYS = [['Ctrl K  or  /','Search & commands'],['Tab (in search)','Switch Go / Ask'],['1 – 9','Destinations'],['F','Focus on the next action'],['← →','Scrub snapshots'],['Esc','Close the top overlay'],['?','This sheet']];
  const DRAFTS = { a: 'fix(header): tighten layout and cart badge\n\n- adjust header spacing on small screens\n- move cart count into the badge\n- tidy globals.css', b: 'feat(collector): phase 4 queue + tests\n\n- add retry queue\n- add test_phase4.py', e: 'chore: initial commit', h: 'refactor: trim landing sections' };
  return { MON, DOW, dayAt, fmtD, LEVELS, levelOf, NAV, SUBS, ST, TIER, P0, T0, IDEAS, KIND, AUTOS, LIBRARY, SCHEDULED, RUN_OUT, INITIAL_RUNS, SESSIONS, CANVAS, WEEKS, ACH, ISSUES, VITALS, CLUTTER, SITES, POSTS, MENTIONS, VAULTS, LEARN, CAPTURES, HOTKEYS, KEYS, DRAFTS };
})();
