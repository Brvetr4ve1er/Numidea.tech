/**
 * The names law of « Les enquêtes de nuit » (hub/lanterne/enquetes.html, 2026-11-23; the owner's decision of that day
 * takes the defaults of the format's section 12: names as text, examples only, no token named). Separate from
 * scripts/lib/w3m-names.mjs, which is the nine modules' law. scripts/check.mjs (block 8f-4) reads every lant.enq.*
 * value in the three languages against it:
 *
 *   LEVELS  may be printed by any step: the two browsers of case 1, the search engine its second step names, and the
 *           makers' own words for parts of a screen (Wallet and Sync are row labels on a mock settings screen)
 *   CHART   printed on the chart's rows only (keys lant.enq.season.*): the pairs of the owner's map, as text
 *   NEVER   printed nowhere: the maker's other products, a single encyclopedia, a token's name or ticker, marketplaces
 *   PLAIN   Latin-letter words an Arabic value may also hold, none of them a name of a product: the studio's own label
 *           on the door, the unit, the word under question, and the pieces of the invented addresses (RFC 2606's
 *           .example, the maker's own domain)
 *
 * A name is text in Latin letters: no logo, no brand colour; Shields is a plain button with the word.
 * A Latin-letter word in an Arabic value that is on none of these lists fails.
 */
export const LEVELS = ['Chrome', 'Brave', 'Google', 'Chromium', 'Shields', 'Rewards', 'Wallet', 'Sync'];
export const CHART = ['Presearch', 'Spotify', 'Audius', 'WhatsApp', 'Status', 'Signal', 'YouTube', 'Odysee', 'Facebook', 'Farcaster', 'Mastodon', 'Bluesky', 'PayPal', 'MetaMask',
  'Sign-In with Ethereum', 'GoDaddy', 'ENS', 'Dropbox', 'IPFS', 'Filecoin', 'Patreon', 'Unlock Protocol', 'Fantom', 'Sonic'];
export const NEVER = '\\b(Brave Search|Brave Ads|Wikip[eé]dia|Wi-?Fi|BAT|Basic Attention Token|OpenSea|Ethlance|Bitcoin|BTC|ETH|Ether|USDT|USDC|Tether|Binance|Coinbase)\\b';
export const PLAIN = ['NUMIDEA', 'LABS', 'GAMES', 'XP', 'web3', 'JavaScript'];
/* the invented addresses, whole (brave.com.get-browser.example) or spelled piece by piece for a screen reader */
export const ADDRESS = /^(?:[a-z0-9-]+(?:\.[a-z0-9-]+)+(?:\/[a-z0-9.-]*)?|brave|com|example|get-browser|get-brave|download|free|safe-install|[a-z])$/;
