import logo from '/images/logo.png'
import { useState } from 'react'

function Wrapped() {
    const [isTracking, setTracking] = useState(false);
    function updateTracking() {
        const changeTracking = !isTracking;
        chrome.runtime.sendMessage({ type: "SET_TRACKING", tracking: changeTracking });
        setTracking(changeTracking);
    }
    // TODO  downloadWrapped
    //Only for MVP: send a message to background to start downloading wrapped
    /* html:
        <div className="wrapped-button">
        <button>onClick ={downloadWrapped()} </button>
        </div>
    */
    function downloadWrapped() {
        chrome.runtime.sendMessage({ type: "DOWNLOAD" });
    }
    // Final: visit the wrapped site so link the ai wrapped site no message 

    return (<div className="extension">
        <header>
            <h1>AI Wrapped</h1>
            <img src={logo} alt="logo" />
        </header>
        <div className="wrapped-button">
            <h3>Download Wrapped</h3>

        </div>
        <div className="track-button">
            <button
                onClick={updateTracking}
                className={isTracking ? 'stop' : 'start'}>
                {isTracking ? "Stop Tracking" : "Start Tracking"}
            </button>

        </div>
    </div>);
}
export default Wrapped;