import { useEffect, useMemo, useState } from 'react';

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
  const [session, setSession] = useState(null);
  const [loginForm, setLoginForm] = useState({
    email: 'student@synops.local',
    password: 'student123'
  });
  const [error, setError] = useState('');
  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || '/api', []);

  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, message: 'API not connected yet' }));

    const token = window.localStorage.getItem('synops_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then((response) => response.json())
        .then((payload) => {
          if (payload.user) {
            setSession({ ...payload.user, token });
          }
        })
        .catch(() => {
          window.localStorage.removeItem('synops_token');
        });
    }
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginForm)
    });

    const payload = await response.json();

    if (!response.ok) {
      setError(payload.message || 'Login failed');
      return;
    }

    window.localStorage.setItem('synops_token', payload.token);
    setSession({ ...payload.user, token: payload.token });
  }

  async function handleLogout() {
    window.localStorage.removeItem('synops_token');
    setSession(null);
    await fetch(`${apiUrl}/auth/logout`, { method: 'POST' });
  }

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

      <section className="card auth-card">
        <div>
          <p className="card-name">Auth starter</p>
          <h2>{session ? `Logged in as ${session.name}` : 'Login with a demo account'}</h2>
          <p>
            Student: student@synops.local / student123, Faculty: faculty@synops.local / faculty123,
            Admin: admin@synops.local / admin123
          </p>
        </div>

        {session ? (
          <div className="auth-session">
            <p><strong>Role:</strong> {session.role}</p>
            <p><strong>Email:</strong> {session.email}</p>
            <button className="button" type="button" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <label>
              Email
              <input name="email" value={loginForm.email} onChange={handleChange} />
            </label>
            <label>
              Password
              <input name="password" type="password" value={loginForm.password} onChange={handleChange} />
            </label>
            {error ? <p className="error-text">{error}</p> : null}
            <button className="button" type="submit">Login</button>
          </form>
        )}
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
