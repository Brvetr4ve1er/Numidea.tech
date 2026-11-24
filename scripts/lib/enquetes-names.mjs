/**
 * The names law of « Les enquêtes de nuit » (hub/lanterne/enquetes.html, 2026-11-23; the owner's decision of that day
 * takes the defaults of the format's section 12: names as text, examples only, no token named). Separate from
 * scripts/lib/w3m-names.mjs, which is the nine modules' law. scripts/check.mjs (block 8f-4) reads every lant.enq.*
 * value in the three languages against it:
 *
 *   LEVELS  may be printed by any step: the two browsers of case 1, the search engine its second step names, and the
 *           makers' own words for parts of a screen (Wallet and Sync are row labels on a mock settings screen)
 *   CHART   printed on the chart's rows only (keys lant.enq.season.*): the pairs of the owner's map, as text
 *   CASES   a case's own names, printed in its own strings (lant.enq.c.<slug>.*) only
 *   NEVER   printed nowhere: the maker's other products, a single encyclopedia, a token's name or ticker, marketplaces
 *   PLAIN   Latin-letter words an Arabic value may also hold, none of them a name of a product: the studio's own label
 *           on the door, the unit, the word under question, and the pieces of the invented addresses (RFC 2606's
 *           .example, the maker's own domain)
 *   HANDLES the invented user names of the mock screens (@samia_gym), read whole in an Arabic value
 *   TERMS   the makers' own words a case's sources print (a feature, a phase, a command, a unit, a name's ending),
 *           read in that case's Arabic values only (2026-11-24, cases 6 to 13)
 *
 * A name is text in Latin letters: no logo, no brand colour; Shields is a plain button with the word.
 * A Latin-letter word in an Arabic value that is on none of these lists fails.
 */
export const LEVELS = ['Chrome', 'Brave', 'Google', 'Chromium', 'Shields', 'Rewards', 'Wallet', 'Sync'];
/* the names among LEVELS (case 1's two browsers, its search engine, its engine and Brave's Shields): a case prints one
   only from its own list (scripts/check.mjs reads them with CHART, 2026-11-24). Wallet and Sync are row labels, and
   Rewards is also a plain word that opens a sentence (case 2: « Rewards are kept on an account »), so none is a name here */
export const LEVEL_NAMES = LEVELS.filter((n) => !['Wallet', 'Sync', 'Rewards'].includes(n));
export const CHART = ['Presearch', 'Spotify', 'Audius', 'WhatsApp', 'Status', 'Signal', 'YouTube', 'Odysee', 'LBRY', 'Facebook', 'District', 'Farcaster', 'Mastodon', 'Bluesky', 'PayPal', 'MetaMask',
  'Sign-In with Ethereum', 'GoDaddy', 'ENS', 'Dropbox', 'IPFS', 'Filecoin', 'Patreon', 'Unlock Protocol', 'Fantom', 'Sonic'];
/* the names each case may print in its own strings (lant.enq.c.<slug>.*: its files and what it copies to the chart),
   by its slug (the season plan of 2026-11-23, section 6); case 1 keeps LEVELS; the misprint (c13) every chart name, and
   Chrome and Brave, the chart's row 1 it reads back */
export const CASES = { brave: LEVELS, presearch: ['Google', 'Presearch', 'Chrome', 'Brave'], audius: ['Spotify', 'Audius'], status: ['WhatsApp', 'Status', 'Signal'], odysee: ['YouTube', 'Odysee', 'LBRY'],
  farcaster: ['Facebook', 'District', 'Farcaster', 'Mastodon', 'Bluesky'], key: [], metamask: ['PayPal', 'MetaMask'], siwe: ['Google', 'Sign-In with Ethereum'], ens: ['GoDaddy', 'ENS'],
  ipfs: ['Dropbox', 'IPFS', 'Filecoin'], unlock: ['Patreon', 'Unlock Protocol'], misprint: [...CHART, 'Chrome', 'Brave'] };
/* the makers' own words each case's sources print, by slug (2026-11-24): ENS's support pages name the .eth ending and the
   Price Cooldown phase, GoDaddy's help Domain Privacy and the .org ending; IPFS's docs the CID, its bafy and Qm starts,
   the add command, the /ipfs/ path, URLs and GiB; Filecoin's docs storage onramps; Sign-In with Ethereum's message
   format an https URI */
export const TERMS = { ens: ['eth', 'org', 'Price Cooldown', 'Domain Privacy'], ipfs: ['CID', 'bafy', 'Qm', 'add', 'ipfs/', 'URL', 'GiB', 'onramps'], siwe: ['https'] };
/* token names and tickers join the never-list with the season (no token is named; a mock says « a token »): the open
   cases' tokens map-facts.md names (PRE, AUDIO, FTM, FIL, and LBRY's Credits), and the short forms LBC and SNT kept off
   too for cases 4 and 5, case-sensitive, so that the words « pre » or « audio » are not caught */
export const NEVER = '\\b(Brave Search|Brave Ads|Wikip[eé]dia|Wi-?Fi|BAT|Basic Attention Token|OpenSea|Ethlance|Bitcoin|BTC|ETH|Ether|USDT|USDC|Tether|Binance|Coinbase|PRE|AUDIO|FTM|FIL|LBC|LBRY Credits?|SNT)\\b';
export const PLAIN = ['NUMIDEA', 'LABS', 'GAMES', 'XP', 'web3', 'JavaScript'];
/* the invented addresses, whole (brave.com.get-browser.example) or spelled piece by piece for a screen reader; the
   pieces of cases 2 to 5 added with the season (2026-11-23): presearch.com.search-login.example and its kin */
/* cases 6 to 13 (2026-11-24): the shortened hex addresses (0x4f2…b81), the shortened content addresses (bafy…k4q,
   QmW…gP), an ISO time's pieces (T21, Z), the words two look-alike addresses are compared on (help, official,
   order-desk, fri, end, ab, chain, chaln), and the parts of invented mail addresses and paths (samia, orders, reports) */
export const ADDRESS = /^(?:[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[a-z0-9.-]*)?|brave|com|example|get-browser|get-brave|download|free|safe-install|presearch|search|search-login|sign-in|account|extensions|[a-z]|[A-Z]|x4f2|b81|x71c|a2|x9c1|x9d4|e07|x4e2|b18|x9a7|d03|k4q|k4r|m7a|n7a|QmW|gP|T21|help|official|order-desk|fri|end|ab|chain|chaln|samia|orders|reports)$/;
/* the invented user names the mock screens print (cases 3 and 5), whole: an Arabic value may hold them as they are */
export const HANDLES = ['@samia_gym', '@samai_gym', '@samiagym', '@coachlina', '@gymclips', '@nour_k', '@trainergym', '@supplier_desk'];
