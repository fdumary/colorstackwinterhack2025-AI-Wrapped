import { useState, useEffect} from 'react'
import logo from '/images/logo.png'
import './Wrapped.css'

function Wrapped() {
    const [view, setView] = useState('landing');
    const [data, setData] = useState(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const res = await fetch('./sample_data.json');
                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error('Failed to load sample_data.json:', err);
                setData({ __error: String(err) });
            }
        };

        loadData();
    }, []);

    if (!data) return <div className="loading">Loading…</div>;
    if (data.__error) return <div className="loading">Error: {data.__error}</div>;


    if (view === 'landing') {
        return (
            <div className="page landing">
                <header>
                    <img src={logo} alt="AI Wrapped logo" />
                </header>
                <h1>AI WRAPPED</h1>
                <p>Your Week in AI — Summarized</p>
                <ul>
                    <li>Total AI prompts</li>
                    <li>Top prompt categories</li>
                    <li>Responsible AI signals</li>
                    <li>Reflection about AI usage</li>
                </ul>
                <p className="hook">
                    See how you relied on AI this week — and how responsibly
                </p>
                <button onClick={() => setView('text')}>
                    View This Week’s Wrapped
                </button>
            </div>
        )
    }

    if (view === 'text') {
        return (
            <div className="page text-summary">

                <h2>Dec 21 – Dec 27</h2>

                <section>
                    <h3>Overview</h3>
                    <p>Total AI prompts: 37</p>
                    <p>Active days: 5</p>
                    <p>Avg prompts/day: 7.4</p>
                </section>

                <section>
                    <h3>Responsible AI Signals</h3>
                    <p>29% lacked source verification</p>
                    <p>18% used definitive language</p>
                    <p>9% involved sensitive domains</p>
                </section>
                
                <button onClick={() => setView('graph')}>
                    Go to Graph Summary
                </button>
            
            </div>
        )
    }

    return (
        <div className="page graph-summary">
            <h2>Weekly Usage</h2>
            <p>Most AI usage happened on Sunday.</p>
            {/* placeholder for bar chart */}
            <div className="chart-placeholder" />
            <button onClick={() => setView('text')}>
                Go to Text Summary
            </button>
        </div>
    )
}

export default Wrapped;