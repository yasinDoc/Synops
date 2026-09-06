import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { CalendarClock, DoorOpen, Users2, BookOpen } from 'lucide-react';

export const DepartmentDefenseSchedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.getAllDefenseSchedules()
      .then((res) => {
        if (mounted) setSchedules(res?.items || []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>Department Defense Schedule</h2>
        <p style={{ color: '#64748b', marginTop: '0.35rem' }}>
          Read-only view of every scheduled defense across the department — room, date, time, and
          assigned board members. This is informational only; supervision assignments and reviews
          still happen from your own dashboard.
        </p>
      </div>

      {loading ? (
        <p style={{ color: '#94a3b8' }}>Loading schedule...</p>
      ) : schedules.length === 0 ? (
        <p style={{ color: '#94a3b8' }}>No defenses have been scheduled yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {schedules.map((item) => (
            <div
              key={item.id}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1.25rem 1.5rem',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <BookOpen size={18} color="#6366f1" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.thesisTitle}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.studentName}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.88rem' }}>
                <DoorOpen size={16} />
                {item.room}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.88rem' }}>
                <CalendarClock size={16} />
                <span>{item.date} &middot; {item.time}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontSize: '0.85rem' }}>
                <Users2 size={16} style={{ flexShrink: 0 }} />
                <span>
                  {item.boardMembers?.length
                    ? item.boardMembers.map((m) => m.name).join(', ')
                    : 'No board members assigned yet'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
