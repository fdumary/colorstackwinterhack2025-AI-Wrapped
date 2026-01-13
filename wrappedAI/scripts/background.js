
function getPlatform(url) {
    if (!url) {
        return null;
    }
    else {
        if (url.includes("claude.ai")) {
            return "claude";
        }
        if (url.includes("chatgpt") || url.includes("chat.openai")) {
            return "chatgpt";
        }
    }
    return null;
}
function routeMessage(message, sender, sendResponse) {
    if (message.type === "SET_TRACKING") {
        if (sender.tab) {

            return;
        }
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const tab = tabs[0];
            if (!tab) {
                sendResponse({ tracking: false, error: "No active tab found" });
                return;
            }
            const platform = getPlatform(tab.url);
            if (!platform) {
                sendResponse({ tracking: false, error: "Please open claude or gpt for tracking" });
                return;
            }
            const newTracking = message.tracking;
            const partJSON = { convoId: crypto.randomUUID(), platform: platform, tabId: tab.id };


            chrome.storage.local.set({ isTracking: newTracking }, () => {
                chrome.tabs.sendMessage(tab.id, { type: "SET_TRACKING", tracking: newTracking, convoJSON: partJSON }).then((response) => {
                    sendResponse({ tracking: newTracking });
                }).catch(error => {
                    sendResponse({ tracking: newTracking });
                });
            });
        });
        return true;
    }
    if (message.type === "NEW_CONVO") {
        chrome.storage.local.get({ allConvos: [] }, (response) => {
            const allConvos = response.allConvos;
            allConvos.push(message.data);
            chrome.storage.local.set({ allConvos }, () => {
                sendResponse({ saved: true, convoLength: allConvos.length });
            });
        });
        return true;
    }
    if (message.type === "GET_TRACKING") {
        chrome.storage.local.get({ isTracking: false }, (response) => {
            sendResponse({ tracking: response.isTracking });
        });
        return true;
    }
    return false;
}
chrome.runtime.onMessage.addListener(routeMessage);