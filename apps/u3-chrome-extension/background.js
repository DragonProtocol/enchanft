chrome.action.onClicked.addListener(function () {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});

var HEADERS_TO_FILTER = ["Content-Security-Policy", "X-Frame-Options", "Frame-Options"];

chrome.runtime.onInstalled.addListener(() => {
  const RULE = {
    id: 1,
    condition: {
      // initiatorDomains: [chrome.runtime.id],
      resourceTypes: ['main_frame', 'sub_frame'],
    },
    action: {
      type: 'modifyHeaders',
      responseHeaders: HEADERS_TO_FILTER.map(header => ({ header, operation: 'remove' }))
    },
  };
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE.id],
    addRules: [RULE],
  });
});
