let isTracking = false;
let isConvo = false;
let partJSON = null;
let currConvo = null;
let gptObserver = null;
let trackingStart = null;
let trackingEnd = null;
let extractInterval = null;

function routeMessage(message, sender, sendResponse) {
  console.log("Content script received message:", message);
  if (message.type === "SET_TRACKING") {
    isTracking = message.tracking;
    partJSON = message.convoJSON;

    if (isTracking) {
      currConvo = null; 
      trackingStart = new Date().toISOString();
      startExtraction();
    }

    else {
      trackingEnd = new Date().toISOString();
      endExtraction();
    }
    sendResponse({ gotState: true, tracking: isTracking });
    return true;
  }
  sendResponse({ gotState: false });
  return true;
}
chrome.runtime.onMessage.addListener(routeMessage);
function periodicExtraction() {
  if (isTracking && activeGPT()) {
    extractGPT();
  }
}
function startExtraction() {
  if (!partJSON) {
    return;
  }
  if (partJSON.platform == "chatgpt") {
    if (activeGPT()) {
      extractGPT();
      extractInterval = setInterval(periodicExtraction, 5000);
      return;

    }

    if (gptObserver) {
      return;
    }
    gptObserver = new MutationObserver(() => {
      if (!isTracking) { return; }
      if (activeGPT()) {
        extractGPT();
        extractInterval = setInterval(periodicExtraction, 5000);
        gptObserver.disconnect();
        gptObserver = null;
      }
    });
    gptObserver.observe(document.body, { childList: true, subtree: true });
  }
  if (partJSON.platform == "claude") { }
}
function endExtraction() {
  if (gptObserver) {
    gptObserver.disconnect();
    gptObserver = null;
  }
  if (extractInterval) {
    clearInterval(extractInterval);
    extractInterval = null;
  }
  if (!currConvo) {
    console.log("No currConvo to save");
    return;
  }
  currConvo.end_time = trackingEnd;
  const startSec = new Date(currConvo.start_time).getTime();
  const endSec = new Date(currConvo.end_time).getTime();
  currConvo.duration = (endSec - startSec) / 1000
  console.log("sending the NEW_CONVO to chrome storage", currConvo);
  chrome.runtime.sendMessage({ type: "NEW_CONVO", data: currConvo })
    .then(response => console.log("the response after saving NEW_CONVO", response))
    .catch(err => console.error("failed to send NEW_CONVO", err));
  currConvo = null;
  isConvo = false;
  partJSON = null;

}
function activeGPT() {
  let findUser = false;
  let findAssistant = false;
  const nodes = document.querySelectorAll('[data-message-author-role]');
  for (const node of nodes) {
    const role = node.getAttribute("data-message-author-role");
    const nodeText = (node.innerText || "").trim()
    if (!nodeText) {
      continue;
    }
    if (role === "user") {
      findUser = true
    }
    if (role === "assistant" && nodeText.length >= 10) {
      findAssistant = true;
    }
    if (findUser && findAssistant) {
      break;
    }
  }
  if (!(findUser && findAssistant)) {
    return false
  }
  if (!currConvo) {
    currConvo = { convo_id: partJSON.convoId, tab_id: partJSON.tabId, start_time: trackingStart, end_time: null, platform: partJSON.platform, duration: null, chat_title: document.title, chat_msgs: [], chat_cat: null };
    isConvo = true;
  }
  return true;
}
function extractGPT() {
  if (!currConvo) {
    return;
  }
  const nodes = document.querySelectorAll('[data-message-author-role]');
  const msgs = []
  for (const node of nodes) {
    const role = node.getAttribute("data-message-author-role");
    const content = (node.innerText || "").trim();
    if (!content) {
      continue;
    }
    
    msgs.push({ role: role, content: content})

  }

  currConvo.chat_msgs = msgs;
  console.log("saved messages, message count: ", msgs.length);
}
