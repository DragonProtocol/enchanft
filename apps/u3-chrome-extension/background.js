chrome.action.onClicked.addListener(async () => {
  const tab = await getTab();

  chrome.tabs.create({
    url: 'https://u3.xyz/contents/create?url=' + tab,
  });
});

var HEADERS_TO_FILTER = [
  'Content-Security-Policy',
  'X-Frame-Options',
  'Frame-Options',
];

chrome.runtime.onInstalled.addListener(() => {
  const RULE = {
    id: 1,
    condition: {
      // initiatorDomains: [chrome.runtime.id],
      resourceTypes: ['main_frame', 'sub_frame'],
    },
    action: {
      type: 'modifyHeaders',
      responseHeaders: HEADERS_TO_FILTER.map((header) => ({
        header,
        operation: 'remove',
      })),
    },
  };
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE.id],
    addRules: [RULE],
  });
});

// --------------------------- utils -----------------------------

async function getTab() {
  let queryOptions = { active: true, currentWindow: true };
  let tabs = await chrome.tabs.query(queryOptions);
  return tabs[0].url;
}

// async function getCookie() {
//   return new Promise((res, rej) => {
//     try {
//       chrome.cookies.get({ url: "https://u3.xyz", name: "u3_token" }, (cookies) => {
//         res(cookies?.value)
//       })
//     } catch (error) {
//       rej(error)
//     }
//   })
// }
