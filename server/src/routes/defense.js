import { Router } from 'express';
import { findThesisById } from '../models/thesisModel.js';
import { findUserById } from '../store/usersStore.js';

const schedules = [
  {
    id: 1,
    thesisId: 1,
    room: 'Auditorium A-204',
    date: '2026-09-10',
    time: '10:00 AM',
    boardMemberIds: [2]
  }
];

function enrichSchedule(schedule) {
  const thesis = findThesisById(schedule.thesisId);
  const boardMembers = (schedule.boardMemberIds || []).map((id) => {
    const user = findUserById(id);
    return user ? { id: user.id, name: user.name, email: user.email } : { id, name: `Faculty #${id}` };
  });

  return {
    ...schedule,
    thesisTitle: thesis ? thesis.title : `Thesis #${schedule.thesisId}`,
    studentName: thesis ? thesis.studentName : 'Unknown Student',
    boardMembers
  };
}

const router = Router();

router.get('/', (_req, res) => {
  const enriched = schedules.map(enrichSchedule);
  res.json({ items: enriched, count: enriched.length });
});

router.post('/', (req, res) => {
  const { thesisId, room, date, time, boardMemberIds } = req.body;

  if (!thesisId || !room || !date || !time) {
    return res.status(400).json({ message: 'thesisId, room, date, and time are required' });
  }

  const schedule = {
    id: schedules.length + 1,
    thesisId: Number(thesisId),
    room,
    date,
    time,
    boardMemberIds: Array.isArray(boardMemberIds) ? boardMemberIds.map(Number) : []
  };

  schedules.push(schedule);

  return res.status(201).json({ message: 'Defense schedule saved', schedule: enrichSchedule(schedule) });
});

export default router;