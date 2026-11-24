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
 *
 * A name is text in Latin letters: no logo, no brand colour; Shields is a plain button with the word.
 * A Latin-letter word in an Arabic value that is on none of these lists fails.
 */
export const LEVELS = ['Chrome', 'Brave', 'Google', 'Chromium', 'Shields', 'Rewards', 'Wallet', 'Sync'];
export const CHART = ['Presearch', 'Spotify', 'Audius', 'WhatsApp', 'Status', 'Signal', 'YouTube', 'Odysee', 'LBRY', 'Facebook', 'District', 'Farcaster', 'Mastodon', 'Bluesky', 'PayPal', 'MetaMask',
  'Sign-In with Ethereum', 'GoDaddy', 'ENS', 'Dropbox', 'IPFS', 'Filecoin', 'Patreon', 'Unlock Protocol', 'Fantom', 'Sonic'];
/* the names each case may print in its own strings (lant.enq.c.<slug>.*: its files and what it copies to the chart),
   by its slug (the season plan of 2026-11-23, section 6); case 1 keeps LEVELS */
export const CASES = { brave: LEVELS, presearch: ['Google', 'Presearch', 'Chrome', 'Brave'], audius: ['Spotify', 'Audius'], status: ['WhatsApp', 'Status', 'Signal'], odysee: ['YouTube', 'Odysee', 'LBRY'],
  farcaster: ['Facebook', 'District', 'Farcaster', 'Mastodon', 'Bluesky'], key: [], metamask: ['PayPal', 'MetaMask'], siwe: ['Google', 'Sign-In with Ethereum'], ens: ['GoDaddy', 'ENS'],
  ipfs: ['Dropbox', 'IPFS', 'Filecoin'], unlock: ['Patreon', 'Unlock Protocol'], misprint: CHART };
/* token names and tickers join the never-list with the season (no token is named; a mock says « a token »): the open
   cases' tokens map-facts.md names (PRE, AUDIO, FTM, FIL, and LBRY's Credits), and the short forms LBC and SNT kept off
   too for cases 4 and 5, case-sensitive, so that the words « pre » or « audio » are not caught */
export const NEVER = '\\b(Brave Search|Brave Ads|Wikip[eé]dia|Wi-?Fi|BAT|Basic Attention Token|OpenSea|Ethlance|Bitcoin|BTC|ETH|Ether|USDT|USDC|Tether|Binance|Coinbase|PRE|AUDIO|FTM|FIL|LBC|LBRY Credits?|SNT)\\b';
export const PLAIN = ['NUMIDEA', 'LABS', 'GAMES', 'XP', 'web3', 'JavaScript'];
/* the invented addresses, whole (brave.com.get-browser.example) or spelled piece by piece for a screen reader; the
   pieces of cases 2 to 5 added with the season (2026-11-23): presearch.com.search-login.example and its kin */
export const ADDRESS = /^(?:[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[a-z0-9.-]*)?|brave|com|example|get-browser|get-brave|download|free|safe-install|presearch|search|search-login|sign-in|account|extensions|[a-z])$/;
/* the invented user names the mock screens print (cases 3 and 5), whole: an Arabic value may hold them as they are */
export const HANDLES = ['@samia_gym', '@samai_gym', '@samiagym', '@coachlina', '@gymclips', '@nour_k'];
