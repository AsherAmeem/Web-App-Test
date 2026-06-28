import React, { useState, useEffect } from 'react';
import './App.css';

function StatusBadge({ status }) {
  const color = status === 'ok' ? '#22c55e' : '#ef4444';
  const label = status === 'ok' ? 'Online' : 'Offline';
  return (
    <span style={{ background: color, color: '#fff', borderRadius: 12, padding: '2px 10px', fontSize: 13, fontWeight: 600 }}>
      {label}
    </span>
  );
}

function DeployCard({ name, icon, description }) {
  return (
    <div className="deploy-card">
      <div className="deploy-icon">{icon}</div>
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function App() {
  const [health, setHealth] = useState(null);
  const [info, setInfo] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiBase = process.env.REACT_APP_API_URL || '';

    Promise.all([
      fetch(`${apiBase}/api/health`).then(r => r.json()),
      fetch(`${apiBase}/api/info`).then(r => r.json()),
    ])
      .then(([h, i]) => { setHealth(h); setInfo(i); })
      .catch(() => setError(true));
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Web App Test</h1>
        <p className="subtitle">Deployment Testing Application</p>
      </header>

      <main className="app-main">
        <section className="card status-card">
          <h2>API Status</h2>
          {error ? (
            <p className="error-msg">Could not reach the backend. Make sure the server is running on port 5000.</p>
          ) : health ? (
            <div className="status-grid">
              <div><span className="label">Status</span><StatusBadge status={health.status} /></div>
              <div><span className="label">Environment</span><span className="value">{health.environment}</span></div>
              <div><span className="label">Version</span><span className="value">{health.version}</span></div>
              <div><span className="label">Server time</span><span className="value">{new Date(health.timestamp).toLocaleTimeString()}</span></div>
            </div>
          ) : (
            <p className="loading">Connecting to backend...</p>
          )}
        </section>

        {info && (
          <section className="card">
            <h2>Deployment Methods</h2>
            <p className="section-desc">{info.description}</p>
            <div className="deploy-grid">
              {info.deploymentMethods.map(m => (
                <DeployCard key={m.name} {...m} />
              ))}
            </div>
          </section>
        )}

        <section className="card">
          <h2>Environment</h2>
          <div className="env-grid">
            <div><span className="label">React version</span><span className="value">{React.version}</span></div>
            <div><span className="label">Build mode</span><span className="value">{process.env.NODE_ENV}</span></div>
            <div><span className="label">API URL</span><span className="value">{process.env.REACT_APP_API_URL || 'proxy (localhost:5000)'}</span></div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Web App Test &mdash; built with React &amp; Node.js/Express</p>
      </footer>
    </div>
  );
}
