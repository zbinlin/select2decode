"use strict";

chrome.contextMenus.create({
    id: "s2d-decode-menuitem",
    type: "normal",
    title: "Decode Base64 Text",
    contexts: ["selection"],
});
chrome.contextMenus.onClicked.addListener(function onClick(info, tab) {
    chrome.tabs.sendMessage(tab.id, {
        "action": "decode-select-text",
    }, {
        frameId: info.frameId,
    });
});
