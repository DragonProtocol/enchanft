// chrome.action.onClicked.addListener(async () => {
//   const activeTab = await getTab();

//   chrome.tabs.sendMessage(activeTab.id, {
//     message: 'clicked_browser_action',
//     tab: activeTab,
//   });
// });

chrome.contextMenus.create({
  id: 'U3',
  type: 'normal',
  title: 'add content',
  contexts: ['all'],
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const token = await getCookie();
  chrome.tabs.sendMessage(tab.id, {
    message: 'clicked_browser_action',
    tab,
    token,
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
  return tabs[0];
}

async function getCookie() {
  return new Promise((res, rej) => {
    try {
      chrome.cookies.get(
        { url: 'https://u3.xyz', name: 'u3_token' },
        (cookies) => {
          res(cookies?.value);
        }
      );
    } catch (error) {
      rej(error);
    }
  });
}
