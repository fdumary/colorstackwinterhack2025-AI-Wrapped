import { useState, useEffect } from 'react'
import logo from '/images/logo.png'
import './Wrapped.css'

function Wrapped() {
  const [view, setView] = useState('landing');
  const [data, setData] = useState(null);
  const [isTracking, setTracking] = useState(false);
  const [mes, siteMessage] = useState(null);

  function updateTracking() {
    const changeTracking = !isTracking;
    console.log('Popup: clicked, current state:', changeTracking);
    chrome.runtime.sendMessage({ type: "SET_TRACKING", tracking: changeTracking }, (response) => {
      if (response.error) {
        siteMessage(response.error);
        setTracking(false);
      }
      else {
        siteMessage(null);
        setTracking(response.tracking)
      }
    });
  }
  useEffect(() => {
    chrome.runtime.sendMessage({ type: "GET_TRACKING" }, (response) => {
      if (chrome.runtime.lastError) {
        setTracking(false);
        return;
      }
      setTracking(response?.tracking || false);
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const url = chrome.runtime.getURL('sample_data.json')
        const res = await fetch(url)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error('Failed to load sample_data.json:', err)
        setData({ __error: String(err) })
      }
    }
    loadData()
  }, [])

  if (!data) return <div className="loading">Loading…</div>
  if (data.__error) return <div className="loading">Error: {data.__error}</div>

  /**
   * ---- Data mapping (safe defaults) ----
   * Update these keys if your sample_data.json differs.
   */
  const prompts = Array.isArray(data.prompts) ? data.prompts : []
  const categories = data.categories && typeof data.categories === 'object' ? data.categories : null
  const signals = data.responsible_ai_signals && typeof data.responsible_ai_signals === 'object'
    ? data.responsible_ai_signals
    : null

  // Overview
  const totalPrompts = prompts.length
  const activeDays = (() => {
    const s = new Set()
    prompts.forEach(p => {
      if (p && p.day) s.add(p.day)
    })
    return s.size
  })()
  const avgPerDay = activeDays ? (totalPrompts / activeDays) : 0

  // Graph counts (Sun..Sat)
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const counts = [0, 0, 0, 0, 0, 0, 0]

  const toIndex = (d) => {
    if (d === 0 || d === '0') return 0
    if (d === 1 || d === '1') return 1
    if (d === 2 || d === '2') return 2
    if (d === 3 || d === '3') return 3
    if (d === 4 || d === '4') return 4
    if (d === 5 || d === '5') return 5
    if (d === 6 || d === '6') return 6

    const map = {
      Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
      Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6,
      S: 0, M: 1, T: 2, W: 3, Th: 4, F: 5, Sa: 6
    }
    return map[d] ?? null
  }

  prompts.forEach(p => {
    const idx = p?.day != null ? toIndex(p.day) : null
    if (idx !== null) counts[idx] += 1
  })

  const maxCount = Math.max(1, ...counts)
  const mostIdx = counts.indexOf(Math.max(...counts))
  const mostDay = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][mostIdx]

  // Category values (fallback to your mock numbers if missing)
  const educationPct = categories?.education ?? 48
  const careerPct = categories?.career ?? 21
  const creativePct = categories?.creative ?? 19
  const highStakesPct = categories?.high_stakes ?? 12

  // Responsible AI signals (fallback to your mock numbers if missing)
  const lackingSourcePct = signals?.lacking_source_verification ?? 29
  const definitiveLanguagePct = signals?.definitive_language ?? 18
  const sensitiveDomainsPct = signals?.sensitive_domains ?? 9
  const energyLine = signals?.energy_equivalent ?? 'charging a laptop once'

  if (view === 'landing') {
    return (
      <div className="page center landing">
        <img className="logo" src={logo} alt="AI Wrapped logo" />

        <div>
          <div className="subtitle">Your Week in AI — Summarized</div>
        </div>

        <ul className="bullets">
          <li>Total AI prompts</li>
          <li>Top prompt categories</li>
          <li>Responsible AI signals</li>
          <li>Reflection about AI usage</li>
        </ul>

        <p className="p">
          See how you relied on AI this week — and how responsibly
        </p>
        <button className="btn" onClick={() => setView('tracking')}>
          Manage Tracking
        </button>
        <button className="btn" onClick={() => setView('text')}>
          View This Week’s Wrapped
        </button>

        <div className="footer">
          Tracks usage metadata only. No prompt content stored by default.
        </div>
      </div>
    )
  }

  if (view === 'text') {
    return (
      <div className="page text-summary">
        <h2>Dec 21 – Dec 27</h2>

        <div className="section">
          <div className="section-title">Overview</div>
          <div className="kv"><span>Total AI prompts</span><strong>{totalPrompts || 37}</strong></div>
          <div className="kv"><span>Active days</span><strong>{activeDays || 5}</strong></div>
          <div className="kv"><span>Avg prompts/day</span><strong>{(avgPerDay || 7.4).toFixed(1)}</strong></div>
        </div>

        <div className="section">
          <div className="section-title">Top Prompt Categories</div>
          <div className="kv"><span>Education</span><strong>{educationPct}%</strong></div>
          <div className="kv"><span>Career</span><strong>{careerPct}%</strong></div>
          <div className="kv"><span>Creative</span><strong>{creativePct}%</strong></div>
          <div className="kv"><span>High-Stakes Topics</span><strong>{highStakesPct}%</strong></div>
        </div>

        <div className="section">
          <div className="section-title">Responsible AI Signals</div>
          <ul className="signals">
            <li><span className="highlight">{lackingSourcePct}%</span> of prompts lacked source verification</li>
            <li><span className="highlight">{definitiveLanguagePct}%</span> used definitive language</li>
            <li><span className="highlight">{sensitiveDomainsPct}%</span> involved sensitive domains (health, legal, financial)</li>
            <li>Energy consumption equivalent to <span className="highlight">{energyLine}</span></li>
          </ul>
        </div>

        <button className="btn" onClick={() => setView('graph')}>
          Go to Graph Summary
        </button>

        <div className="footer">
          Tracks usage metadata only. No prompt content stored by default.
        </div>
      </div>
    )
  }
  // graph view
  if (view === "graph") {
    return (
      <div className="page graph-summary">
        <h2>Weekly Usage</h2>

        <p className="p">Daily activity (prompts per day)</p>

        <div className="chart">
          <div className="grid">
            {counts.map((c, i) => (
              <div key={i} className="col">
                <div
                  className="bar"
                  style={{ height: `${(c / maxCount) * 100}%` }}
                  title={`${dayLabels[i]}: ${c}`}
                />
                <div className="day">{dayLabels[i]}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title">Insight</div>
          <p className="p">Most AI usage happened on {mostDay}.</p>
        </div>

        <button className="btn" onClick={() => setView('text')}>
          Go to Text Summary
        </button>

        <div className="footer">
          Tracks usage metadata only. No prompt content stored by default.
        </div>
      </div>
    )
  }
  if (view === "tracking") {
    return (<div className="page center landing">
      <header>
        <img src={logo} alt="logo" />
      </header>
      <div className="wrapped-button">
        <button className="btn" onClick={() => setView('landing')}>
          AI Wrapped
        </button>

      </div>
      {mes && <div className='site-message'>
        {mes}
      </div>}
      <div className="track-button">
        <button
          className="btn"
          onClick={updateTracking}>
          {isTracking ? "Stop Tracking" : "Start Tracking"}
        </button>

      </div>
    </div>)
  }



}
export default Wrapped