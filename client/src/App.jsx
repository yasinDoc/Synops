import { useEffect, useState } from 'react';

const branchCards = [
  {
    name: 'Yasin',
    branch: 'feature/yasin-backend',
    work: 'Backend API, database models, similarity checker'
  },
  {
    name: 'Tutul',
    branch: 'feature/tutul-frontend',
    work: 'React UI, dashboards, forms'
  },
  {
    name: 'Saman',
    branch: 'feature/saman-admin-db',
    work: 'Admin module, DB schema, seed data'
  },
  {
    name: 'Jishan',
    branch: 'feature/jishan-auth-scheduling',
    work: 'Auth, roles, defense scheduling, notifications'
  }
];

export default function App() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, message: 'API not connected yet' }));
  }, []);

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Synops</p>
        <h1>Thesis management for students, faculty, and admins.</h1>
        <p className="lead">
          This starter shows the branch split and gives each teammate a clear place to work.
        </p>
        <div className="status-card">
          <span className={`pill ${health?.ok ? 'pill-good' : 'pill-warn'}`}>
            {health?.ok ? 'API connected' : 'API checking'}
          </span>
          <span>{health?.message || 'Loading backend status...'}</span>
        </div>
      </section>

      <section className="grid">
        {branchCards.map((card) => (
          <article className="card" key={card.branch}>
            <p className="card-name">{card.name}</p>
            <h2>{card.branch}</h2>
            <p>{card.work}</p>
          </article>
        ))}
      </section>

      <section className="card workflow-card">
        <h2>Simple workflow</h2>
        <ol>
          <li>Pull `dev`.</li>
          <li>Work in your feature branch.</li>
          <li>Commit small changes.</li>
          <li>Push and open a PR to `dev`.</li>
        </ol>
      </section>
    </main>
  );
}
