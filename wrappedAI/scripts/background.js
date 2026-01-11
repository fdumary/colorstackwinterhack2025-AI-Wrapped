/* MVP Local storage and retrieval : Used to store extraction json puts them into local storage. The stored json are then retrieved when user requests them */
/* Final Saves to Cloud: Goal saves to the cloud (firebase) for the wrapped websites data  */

let currConvos = [];
let isTracking = false;
// handles messages between
// background <-> popup (buttons : tracking, download/save to cloud)
// background <-> content (current chat convos : json used to store chat/extraction info)
function routeMessage(message, sender, sendResponse) {
    if (message.type === "SET_TRACKING") {
        isTracking = message.tracking;
        // content tracking has been set
        if (sender.tab) {
            console.log("content has received isTracking");
        }
        else {
            // popup has requested to start/stop extraction rely this to content
            chrome.tabs.query({}, (tabs) => {
                tabs.forEach(tab => {
                    //  TODO function isAISite() -> verifies if the tab is matches for a extraction site
                    const platform = getPlatform(tab.url);
                    if (platform) {
                        const partJSON = {
                            convoId: crypto.randomUUID(),
                            platform: platform,
                            tabId: tab.id

                        };
                        chrome.tabs.sendMessage(tab.id, { type: "SET_TRACKING", tracking: isTracking, convoJSON: partJSON }).then((response) => {
                            console.log("Got response: ", response);
                        }).catch(error => { console.log("failed to select tab: ", error) });


                    }
                });

            });

        }
        sendResponse({ tracking: isTracking });
    }
    if (message.type === "NEW_CONVO") {
        // MVP ONLY
        currConvos.push(message.data);
        console.log("saved convo");
        sendResponse({ saved: true });
        // FINAL Push to cloud
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
// TODO MVP only: download json 
function downloadJSON() {

}
// get everything from chrome storage and format to a JSON to down load