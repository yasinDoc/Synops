import { Router } from 'express';

const schedules = [
  {
    id: 1,
    thesisId: 1,
    room: 'A-204',
    date: '2026-09-10',
    time: '10:00',
    boardMemberIds: [3]
  }
];

const router = Router();

router.get('/', (_req, res) => {
  res.json({ items: schedules });
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

  return res.status(201).json({ message: 'Defense schedule saved', schedule });
});

export default router;