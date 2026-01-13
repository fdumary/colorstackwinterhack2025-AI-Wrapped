import './App.css'

export default function App() {
  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <img src="/image.png" alt="AI Wrapped logo" className = "logo"/>
        </div>

        <a className="download" href="https://github.com/fdumary/colorstackwinterhack2025-AI-Wrapped?tab=readme-ov-file#setup--installation-instructions" target="_blank" rel="noreferrer">
          Download Extension
        </a>
      </header>

      <main className="hero">
        <div className="heroInner">
          <img src="/image_2.png" alt="AI Wrapped logo" className = "heroLogo"/>
          <p className="subtitle">Your Week in AI — Summarized</p>

          <ul className="bullets">
            <li>Total AI prompts</li>
            <li>Top prompt categories</li>
            <li>Responsible AI signals</li>
            <li>Reflection about AI usage</li>
          </ul>

          <p className="hook">
            See how you relied on AI this week — and how responsibly
          </p>

          <button
            className="cta"
            onClick={() => {
              document
                .getElementById('how-it-works')
                .scrollIntoView({ behavior: 'smooth' })
            }}
          >
            View This Week’s Wrapped
          </button>

        </div>
      </main>

      <section id="how-it-works" className="instructions">
        <h2 className="instructionsTitle">How to View Your Weekly Wrapped</h2>

        <ol className="instructionsList">
          <li>
            Click on "Download Extension" to get the <strong>AI Wrapped</strong> Chrome Extension.
          </li>
          <li>
            Go to Chrome, then "Extensions," enable developer mode, load unpacked "wrappedAI" folder.
          </li>
          <li>
            For testing, switch to "extension" branch and install and build npm: "npm install," "npm run build."
          </li>
          <li>
            Go to ChatGPT or Claude, open <strong>AI Wrapped</strong> in your browser, start tracking and recieve your weekly summary.
          </li>
        </ol>

        <p className="instructionsNote">
          Tracks usage metadata only. No prompt content stored by default.
        </p>
      </section>


      <footer className="footer">
        © AI Wrapped. All rights reserved.
      </footer>
    </div>
  )
}
