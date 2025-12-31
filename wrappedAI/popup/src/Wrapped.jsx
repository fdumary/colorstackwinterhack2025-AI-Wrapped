import { useState } from 'react'
import logo from '/images/logo.png'
function Wrapped() {
    const [tracking, changeBut] = useState(false);
    return (
        <div className="extension">
            <header>
                <h1>wrapped AI</h1>
                <img src={logo} alt="logo" />
            </header>
            <div className="wrapped-button">
                <h3>Download Wrapped</h3>
            </div>
            <div className="track-button">
                <button
                    onClick={() => changeBut(!tracking)}
                    className={tracking ? 'stop' : 'start'}>
                    {tracking ? "Stop Tracking" : "Start Tracking"}
                </button>

            </div>
        </div>
    );
}
export default Wrapped;