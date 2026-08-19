import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navbar } from '../../components/layout/Navbar';
import { Users, FileText, Calendar, Search, ShieldAlert } from 'lucide-react';

const TABS = [
  { id: 'theses', label: 'All Theses & Status', icon: FileText },
  { id: 'users', label: 'User List', icon: Users },
  { id: 'defense', label: 'Defense Scheduling', icon: Calendar },
  { id: 'search', label: 'Repository Search', icon: Search }
];

export const AdminDashboard = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState('theses');

  const [users, setUsers] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [theses, setTheses] = useState([]);
  const [defenses, setDefenses] = useState([]);

  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [selectedSupervisors, setSelectedSupervisors] = useState({});
  const [scheduleForm, setScheduleForm] = useState({
    thesisId: '',
    room: 'Auditorium A-204',
    date: '2026-09-15',
    time: '10:00 AM',
    boardMemberIds: []
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || '/api', []);

  const authHeaders = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (user?.role) {
      headers['x-user-role'] = user.role;
      headers['x-user-id'] = user.id;
    }
    return headers;
  }, [token, user]);

  useEffect(() => {
    if (!user) return;

    fetch(`${apiUrl}/theses`, { headers: authHeaders })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((data) => {
        setTheses(data.items || []);
        if (!scheduleForm.thesisId && data.items?.length > 0) {
          setScheduleForm((prev) => ({ ...prev, thesisId: String(data.items[0].id) }));
        }
      })
      .catch(() => {});

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, apiUrl]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, activeTab, apiUrl]);

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
      setTheses((prev) => prev.map((t) => (t.id === thesisId ? payload.thesis : t)));
    } catch {
      setError('Failed to update supervisor');
    }
  }

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      <Navbar />
      <div className="page-wrapper" style={{ padding: '2.5rem 2rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: 'white',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-danger">
              <ShieldAlert size={13} /> Admin Route Group
            </span>
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>
            Departmental System Administration
          </h2>
          <p style={{ color: '#cbd5e1', marginTop: '0.5rem', maxWidth: '600px' }}>
            Manage users, assign supervisors, schedule defenses, and search the thesis repository.
          </p>
        </div>

        {notice ? <p className="success-text" style={{ marginBottom: '16px' }}>{notice}</p> : null}
        {error ? <p className="error-text" style={{ marginBottom: '16px' }}>{error}</p> : null}

        <nav className="nav-tabs" style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Icon size={15} /> {tab.label}
              </button>
            );
          })}
        </nav>

        {activeTab === 'theses' && (
          <section className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p className="card-name">Admin Control</p>
                <h2>All Theses &amp; Status View</h2>
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

              <button className="button" type="submit" style={{ width: 'fit-content' }}>
                Schedule Defense
              </button>
            </form>

            <div>
              <h3>Scheduled Defenses</h3>
              <div className="table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Schedule ID</th>
                      <th>Thesis Title</th>
                      <th>Room</th>
                      <th>Date &amp; Time</th>
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

        {activeTab === 'search' && (
          <section className="card">
            <p className="card-name">Repository Search</p>
            <h2>Search Academic Thesis Repository</h2>
            <p className="lead" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
              Search by thesis title or student name (<code>GET /api/theses/search?q=...</code>).
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
      </div>
    </div>
  );
};
