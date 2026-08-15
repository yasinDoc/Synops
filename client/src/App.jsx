import { useEffect, useMemo, useState } from 'react';

const branchCards = [
  {
    name: 'Saman',
    branch: 'feature/saman-admin-db',
    work: 'Admin module (User list, Thesis status table, Assign supervisor, Defense scheduling), Trimmed DB schema, Repository search'
  },
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
    name: 'Jishan',
    branch: 'feature/jishan-auth-scheduling',
    work: 'Auth, roles, defense scheduling, notifications'
  }
];

export default function App() {
  const [health, setHealth] = useState(null);
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('theses'); // 'theses', 'users', 'defense', 'search', 'overview'
  const [loginForm, setLoginForm] = useState({
    email: 'admin@synops.local',
    password: 'admin123'
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Admin Data states
  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [theses, setTheses] = useState([]);
  const [defenses, setDefenses] = useState([]);

  // Supervisor assignment state
  const [selectedSupervisors, setSelectedSupervisors] = useState({});

  // Defense scheduling form state
  const [scheduleForm, setScheduleForm] = useState({
    thesisId: '',
    room: 'Auditorium A-204',
    date: '2026-09-15',
    time: '10:00 AM',
    boardMemberIds: []
  });

  // Repository search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || '/api', []);

  const authHeaders = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }
    // Fallback role header if no token
    if (session?.role) {
      headers['x-user-role'] = session.role;
      headers['x-user-id'] = session.id;
    }
    return headers;
  }, [session]);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then(setHealth)
      .catch(() => setHealth({ ok: false, message: 'API not connected yet' }));

    const token = window.localStorage.getItem('synops_token');
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((res) => res.json())
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

  // Fetch Admin Data whenever session or tab changes
  useEffect(() => {
    if (!session) return;

    // Fetch Theses list
    fetch(`${apiUrl}/theses`, { headers: authHeaders })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        setTheses(data.items || []);
        if (!scheduleForm.thesisId && data.items?.length > 0) {
          setScheduleForm((prev) => ({ ...prev, thesisId: String(data.items[0].id) }));
        }
      })
      .catch(() => {});

    // Fetch Admin Users & Faculty
    if (session.role === 'admin') {
      fetch(`${apiUrl}/admin/users`, { headers: authHeaders })
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => setUsers(data.items || []))
        .catch(() => {});

      fetch(`${apiUrl}/admin/faculty`, { headers: authHeaders })
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => setFaculty(data.items || []))
        .catch(() => {});

      fetch(`${apiUrl}/defense`, { headers: authHeaders })
        .then((res) => (res.ok ? res.json() : { items: [] }))
        .then((data) => setDefenses(data.items || []))
        .catch(() => {});
    }
  }, [session, apiUrl, authHeaders]);

  // Handle repository search
  useEffect(() => {
    if (activeTab !== 'search') return;
    setIsSearching(true);
    fetch(`${apiUrl}/theses/search?q=${encodeURIComponent(searchQuery)}`, {
      headers: authHeaders
    })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        setSearchResults(data.items || []);
        setIsSearching(false);
      })
      .catch(() => setIsSearching(false));
  }, [searchQuery, activeTab, apiUrl, authHeaders]);

  function handleChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Login failed');
        return;
      }

      window.localStorage.setItem('synops_token', payload.token);
      setSession({ ...payload.user, token: payload.token });
      setNotice(`Welcome back, ${payload.user.name}!`);
    } catch {
      setError('Connection to backend failed');
    }
  }

  async function handleLogout() {
    window.localStorage.removeItem('synops_token');
    setSession(null);
    setNotice('');
    await fetch(`${apiUrl}/auth/logout`, { method: 'POST' }).catch(() => {});
  }

  // Admin: Assign Supervisor to Thesis
  async function handleAssignSupervisor(thesisId) {
    const supervisorId = selectedSupervisors[thesisId];
    if (!supervisorId) return;

    setError('');
    setNotice('');

    try {
      const response = await fetch(`${apiUrl}/theses/${thesisId}/supervisor`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ supervisorId: Number(supervisorId) })
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Failed to assign supervisor');
        return;
      }

      setNotice(`Supervisor successfully assigned to Thesis #${thesisId}`);
      // Refresh theses
      const updatedTheses = theses.map((t) => (t.id === thesisId ? payload.thesis : t));
      setTheses(updatedTheses);
    } catch {
      setError('Failed to update supervisor');
    }
  }

  // Admin: Defense Scheduling
  async function handleScheduleDefense(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    if (!scheduleForm.thesisId || !scheduleForm.room || !scheduleForm.date || !scheduleForm.time) {
      setError('Please fill in thesis, room, date, and time.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/defense`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          thesisId: Number(scheduleForm.thesisId),
          room: scheduleForm.room,
          date: scheduleForm.date,
          time: scheduleForm.time,
          boardMemberIds: scheduleForm.boardMemberIds
        })
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message || 'Failed to schedule defense');
        return;
      }

      setNotice('Defense schedule created successfully!');
      setDefenses((prev) => [...prev, payload.schedule]);
    } catch {
      setError('Failed to save defense schedule');
    }
  }

  function handleBoardMemberToggle(facultyId) {
    setScheduleForm((prev) => {
      const exists = prev.boardMemberIds.includes(facultyId);
      const updated = exists
        ? prev.boardMemberIds.filter((id) => id !== facultyId)
        : [...prev.boardMemberIds, facultyId];
      return { ...prev, boardMemberIds: updated };
    });
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Synops — Admin & DB Feature</p>
        <h1>Thesis Management & Admin Operations</h1>
        <p className="lead">
          Feature branch <code>feature/saman-admin-db</code>: Trimmed schema, Admin User List, Supervisor Assignment, Defense Scheduling, and Repository Search.
        </p>
        <div className="status-card">
          <span className={`pill ${health?.ok ? 'pill-good' : 'pill-warn'}`}>
            {health?.ok ? 'API connected' : 'API checking'}
          </span>
          <span>{health?.message || 'Loading backend status...'}</span>
        </div>
      </section>

      {/* Auth Card */}
      <section className="card auth-card">
        <div>
          <p className="card-name">Authentication</p>
          <h2>{session ? `Logged in as ${session.name}` : 'Login with a demo account'}</h2>
          {!session ? (
            <p className="lead" style={{ fontSize: '0.88rem' }}>
              Quick switch: Admin (<code>admin@synops.local / admin123</code>), Faculty (<code>faculty@synops.local / faculty123</code>), Student (<code>student@synops.local / student123</code>)
            </p>
          ) : null}
        </div>

        {session ? (
          <div className="auth-session">
            <div>
              <p><strong>Role:</strong> <span className="pill pill-info">{session.role}</span></p>
              <p><strong>Email:</strong> {session.email}</p>
            </div>
            <button className="button button-secondary" type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleLogin}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <label>
                Email
                <input name="email" value={loginForm.email} onChange={handleChange} />
              </label>
              <label>
                Password
                <input name="password" type="password" value={loginForm.password} onChange={handleChange} />
              </label>
            </div>
            {error ? <p className="error-text">{error}</p> : null}
            <button className="button" type="submit" style={{ width: 'fit-content' }}>
              Login
            </button>
          </form>
        )}
      </section>

      {notice ? <p className="success-text" style={{ marginBottom: '16px' }}>{notice}</p> : null}

      {/* Main Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`tab-btn ${activeTab === 'theses' ? 'active' : ''}`}
          onClick={() => setActiveTab('theses')}
        >
          Admin: All Theses & Status
        </button>
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Admin: User List
        </button>
        <button
          className={`tab-btn ${activeTab === 'defense' ? 'active' : ''}`}
          onClick={() => setActiveTab('defense')}
        >
          Admin: Defense Scheduling
        </button>
        <button
          className={`tab-btn ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Repository Search
        </button>
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Sprint Branch Info
        </button>
      </nav>

      {/* TAB 1: ADMIN THESES & STATUS TABLE (With Supervisor Assign) */}
      {activeTab === 'theses' && (
        <section className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p className="card-name">Admin Control</p>
              <h2>All Theses & Status View</h2>
            </div>
            <span className="pill pill-purple">{theses.length} Total Theses</span>
          </div>
          <p className="lead" style={{ fontSize: '0.9rem', marginBottom: '14px' }}>
            Overview of submitted theses, current review statuses, and assigned supervisors.
          </p>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Thesis Title</th>
                  <th>Student</th>
                  <th>Supervisor</th>
                  <th>Status</th>
                  <th>Assign Supervisor</th>
                </tr>
              </thead>
              <tbody>
                {theses.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td>
                      <strong>{item.title}</strong>
                      <br />
                      <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                        {item.abstract?.slice(0, 75)}...
                      </span>
                    </td>
                    <td>{item.studentName || item.student_id || 'Student'}</td>
                    <td>
                      {item.supervisorName ? (
                        <span className="pill pill-info">{item.supervisorName}</span>
                      ) : (
                        <span className="pill pill-warn">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`pill ${item.status === 'approved' ? 'pill-good' : 'pill-info'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="inline-assign-form">
                        <select
                          className="admin-form select"
                          value={selectedSupervisors[item.id] || item.supervisorId || ''}
                          onChange={(e) =>
                            setSelectedSupervisors({ ...selectedSupervisors, [item.id]: e.target.value })
                          }
                        >
                          <option value="">-- Choose Supervisor --</option>
                          {faculty.map((fac) => (
                            <option key={fac.id} value={fac.id}>
                              {fac.name} ({fac.email})
                            </option>
                          ))}
                        </select>
                        <button
                          className="button"
                          type="button"
                          onClick={() => handleAssignSupervisor(item.id)}
                        >
                          Assign
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 2: ADMIN USER LIST VIEW */}
      {activeTab === 'users' && (
        <section className="card">
          <p className="card-name">Admin User Management</p>
          <h2>User List View</h2>
          <p className="lead" style={{ fontSize: '0.9rem', marginBottom: '14px' }}>
            List of registered users across all roles in the trimmed schema.
          </p>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <span
                        className={`pill ${
                          u.role === 'admin'
                            ? 'pill-purple'
                            : u.role === 'faculty'
                            ? 'pill-info'
                            : 'pill-good'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TAB 3: ADMIN DEFENSE SCHEDULING FORM */}
      {activeTab === 'defense' && (
        <section className="card" style={{ display: 'grid', gap: '24px' }}>
          <div>
            <p className="card-name">Admin Operations</p>
            <h2>Defense Scheduling Form</h2>
            <p className="lead" style={{ fontSize: '0.9rem' }}>
              Schedule defense presentations by assigning room, date, time, and faculty board members.
            </p>
          </div>

          <form className="admin-form" onSubmit={handleScheduleDefense} style={{ maxWidth: '600px' }}>
            <label>
              Select Thesis
              <select
                value={scheduleForm.thesisId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, thesisId: e.target.value })}
              >
                {theses.map((t) => (
                  <option key={t.id} value={t.id}>
                    #{t.id} - {t.title} ({t.studentName})
                  </option>
                ))}
              </select>
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <label>
                Room
                <input
                  value={scheduleForm.room}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, room: e.target.value })}
                  placeholder="e.g. Room A-204"
                />
              </label>

              <label>
                Date
                <input
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                />
              </label>

              <label>
                Time
                <input
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  placeholder="e.g. 10:00 AM"
                />
              </label>
            </div>

            <label>
              Select Board Member(s) (Faculty)
              <div className="checkbox-group">
                {faculty.length === 0 ? (
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Loading faculty members...</p>
                ) : (
                  faculty.map((fac) => (
                    <label key={fac.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={scheduleForm.boardMemberIds.includes(fac.id)}
                        onChange={() => handleBoardMemberToggle(fac.id)}
                      />
                      {fac.name} ({fac.email})
                    </label>
                  ))
                )}
              </div>
            </label>

            {error ? <p className="error-text">{error}</p> : null}
            <button className="button" type="submit" style={{ width: 'fit-content' }}>
              Schedule Defense
            </button>
          </form>

          {/* Scheduled Defenses List */}
          <div>
            <h3>Scheduled Defenses</h3>
            <div className="table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Schedule ID</th>
                    <th>Thesis Title</th>
                    <th>Room</th>
                    <th>Date & Time</th>
                    <th>Board Members</th>
                  </tr>
                </thead>
                <tbody>
                  {defenses.map((d) => (
                    <tr key={d.id}>
                      <td>#{d.id}</td>
                      <td><strong>{d.thesisTitle || `Thesis #${d.thesisId}`}</strong></td>
                      <td><span className="pill pill-info">{d.room}</span></td>
                      <td>{d.date} at {d.time}</td>
                      <td>
                        {d.boardMembers?.map((m) => m.name).join(', ') || 'None assigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* TAB 4: REPOSITORY SEARCH PAGE */}
      {activeTab === 'search' && (
        <section className="card">
          <p className="card-name">Repository Search</p>
          <h2>Search Academic Thesis Repository</h2>
          <p className="lead" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
            Uses Yasin's search endpoint (<code>GET /api/theses/search?q=...</code>) to search by thesis title or student name.
          </p>

          <div className="search-box">
            <input
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or student name (e.g. AI, Ledger, Demo)..."
            />
          </div>

          {isSearching ? <p style={{ color: '#94a3b8' }}>Searching repository...</p> : null}

          <div className="search-results-grid">
            {searchResults.length === 0 && !isSearching ? (
              <p style={{ color: '#94a3b8' }}>No matching theses found.</p>
            ) : (
              searchResults.map((thesis) => (
                <article key={thesis.id} className="thesis-card">
                  <div className="thesis-card-header">
                    <h3>{thesis.title}</h3>
                    <span className="pill pill-info">{thesis.status}</span>
                  </div>
                  <div className="meta">
                    <span><strong>Student:</strong> {thesis.studentName || thesis.student_id}</span>
                    <span>
                      <strong>Supervisor:</strong>{' '}
                      {thesis.supervisorName || 'Not assigned'}
                    </span>
                  </div>
                  <p className="abstract">{thesis.abstract}</p>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {/* TAB 5: OVERVIEW CARDS */}
      {activeTab === 'overview' && (
        <section className="grid">
          {branchCards.map((card) => (
            <article className="card" key={card.branch}>
              <p className="card-name">{card.name}</p>
              <h2>{card.branch}</h2>
              <p>{card.work}</p>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
