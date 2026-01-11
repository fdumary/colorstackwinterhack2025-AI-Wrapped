let currConvos = [];
let isTracking = false;
// handles messages between
// background <-> popup (buttons : tracking, download/save to cloud)
// background <-> content (current chat convos : json used to store chat/extraction info)
function routeMessage(message, sender, sendResponse) {
    if (message.type === "SET_TRACKING") {
        // content tracking has been set
        if (sender.tab) {
            console.log("content has received isTracking");
            return;  
        }
        else {
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                const tab = tabs[0];
                const platform = getPlatform(tab.url);
                if (platform) {
                    isTracking = message.tracking;
                    const partJSON = {convoId: crypto.randomUUID(), platform: platform, tabId: tab.id};
                    chrome.tabs.sendMessage(tab.id, { type: "SET_TRACKING", tracking: isTracking, convoJSON: partJSON }).then((response) => {
                    }).catch(error => { console.log("failed to select tab: ", error) });
                    sendResponse({ tracking: isTracking }); 
                }
                else {
                    sendResponse({ tracking: false, error: "Please open claude or gpt for tracking" });
                }

            });    
        }
    }
    if (message.type === "NEW_CONVO") {
        // MVP ONLY
        currConvos.push(message.data);
        console.log("saved convo");
        sendResponse({ saved: true });
    }
    if (message.type === "GET_TRACKING") {
        sendResponse({ tracking: isTracking });
    }
    return true;
}
// getPlatform() -> determines which ai site 
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
chrome.runtime.onMessage.addListener(routeMessage);