let isTracking = false;
let currConvo = null;

// json items
// convo_id(string), tab_id(string), starttime(string), endtime(string), platform(string), duration(int(seconds)), word_count(int), 
// full_chat(array = [{role(string), content(string), timestamp(string)}]), chat_sum(string), chat_cat(string)


function routeMessage(message, sender, sendResponse){
      if (message.type === "SET_TRACKING") {
        isTracking = message.tracking;
        const startTime = new Date().toISOString();
        const partJSON = message.convoJSON;
        if(isTracking){
            currConvo = {convo_id: partJSON.convoId, tab_id: partJSON.tabId,  start_time: startTime, endtime : null, platform : partJSON.platform, duration: null, word_count: null, full_chat: [], chat_sum: null, chat_cat: null};
            // TODO
            startExtraction();
        }
        else{
            // TODO
            endExtraction();
        }
      }
      sendResponse({gotState: true});
}
chrome.runtime.onMessage.addListener(routeMessage);

// TODO startExtraction()
// when isTracking the start extraction will call collectConvo 
function startExtraction(){

}
// TODO collectConvo()
// it will have the extraction logic 
function collectConvo(){

}
// TODO endExtraction()
// endExtraction will listen to when the observer is disconnected then it will call finalizeData()
function endExtraction(){

}
// TODO finalizeData()
// creates a json that will be sent to the background then it will call getSummaryCategory to finalize the respective items
function finalizeData(){

}
// makes api call to Gemini to get a summary and category 
function getSummaryCategory(){

}