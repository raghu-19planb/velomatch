// AFFILIATE LINK TRACKING — fill in your real IDs below once you're enrolled.
// Until you do, applyAffiliateTracking() is a safe no-op: it returns the
// retailer URL unchanged, so nothing breaks while these are still blank.
//
// Two different kinds of program are supported, because they work differently:
//
// 1) AMAZON_TAGS — Amazon Associates. Just a "tag" query param appended to
//    the product URL. One tag per Amazon marketplace domain (amazon.ca vs
//    amazon.com pay out separately, so they need separate tags).
//
// 2) NETWORK_TEMPLATES — almost every other retailer's affiliate program
//    (Walmart, most bike brands, sporting goods chains) runs through a
//    network — Rakuten Advertising, Awin, Impact, CJ Affiliate, etc. — and
//    pays out on a special tracking link *from that network*, not by adding
//    a query param to the retailer's own URL. Once a network approves you
//    for a merchant, its dashboard gives you a link template that looks
//    something like:
//      https://click.linksynergy.com/deeplink?id=YOUR_ID&mid=12345&murl={url}
//    Paste that exact template here, keeping the literal "{url}" in place —
//    this file will substitute the real product URL into it for you.
const AFFILIATE_CONFIG = {
  AMAZON_TAGS: {
    'amazon.ca': 'PASTE_YOUR_AMAZON_CA_ASSOCIATES_TAG_HERE',
    'amazon.com': 'PASTE_YOUR_AMAZON_COM_ASSOCIATES_TAG_HERE'
  },
  NETWORK_TEMPLATES: {
    'walmart.ca': 'PASTE_YOUR_WALMART_AFFILIATE_LINK_TEMPLATE_HERE_KEEP_THE_{url}_PLACEHOLDER'
    // Add more retailers here as you get approved, e.g.:
    // 'mec.ca': 'PASTE_YOUR_MEC_AFFILIATE_LINK_TEMPLATE_HERE_KEEP_THE_{url}_PLACEHOLDER',
  }
};

function isUnsetPlaceholder(value){
  return !value || value.indexOf('PASTE_YOUR_') === 0;
}

// Returns [url, wasAffiliate] so callers can label affiliate links if they want.
function applyAffiliateTracking(rawUrl){
  if (!rawUrl) return [rawUrl, false];
  let host = '';
  try { host = new URL(rawUrl).hostname.replace(/^www\./, ''); } catch (e) { return [rawUrl, false]; }

  const amazonTag = AFFILIATE_CONFIG.AMAZON_TAGS[host];
  if (!isUnsetPlaceholder(amazonTag)) {
    try {
      const u = new URL(rawUrl);
      u.searchParams.set('tag', amazonTag);
      return [u.toString(), true];
    } catch (e) { return [rawUrl, false]; }
  }

  const template = AFFILIATE_CONFIG.NETWORK_TEMPLATES[host];
  if (!isUnsetPlaceholder(template) && template.indexOf('{url}') !== -1) {
    return [template.replace('{url}', encodeURIComponent(rawUrl)), true];
  }

  return [rawUrl, false];
}
