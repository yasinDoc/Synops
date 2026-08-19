let defenseSchedules = [
  {
    id: 1,
    thesisId: 1,
    room: 'A-204',
    date: '2026-09-10',
    time: '10:00',
    boardMemberIds: [2],
    status: 'scheduled',
    notes: 'Please bring presentation slides.'
  }
];

export function getAllDefenseSchedules() {
  return defenseSchedules;
}

export function getDefenseScheduleById(id) {
  return defenseSchedules.find((s) => s.id === Number(id));
}

export function getDefenseScheduleByThesisId(thesisId) {
  return defenseSchedules.find((s) => s.thesisId === Number(thesisId));
}

export function createDefenseSchedule({ thesisId, room, date, time, boardMemberIds = [], notes = '' }) {
  const newSchedule = {
    id: defenseSchedules.length + 1,
    thesisId: Number(thesisId),
    room: String(room).trim(),
    date: String(date).trim(),
    time: String(time).trim(),
    boardMemberIds: Array.isArray(boardMemberIds) ? boardMemberIds.map(Number) : [],
    status: 'scheduled',
    notes: String(notes || '').trim()
  };

  defenseSchedules.push(newSchedule);
  return newSchedule;
}

export function updateDefenseSchedule(id, updates = {}) {
  const index = defenseSchedules.findIndex((s) => s.id === Number(id));
  if (index === -1) return null;

  const current = defenseSchedules[index];
  const updated = {
    ...current,
    ...updates,
    id: current.id
  };

  if (updates.boardMemberIds) {
    updated.boardMemberIds = Array.isArray(updates.boardMemberIds)
      ? updates.boardMemberIds.map(Number)
      : current.boardMemberIds;
  }

  defenseSchedules[index] = updated;
  return updated;
}

export function assignBoardMembers(id, boardMemberIds = []) {
  return updateDefenseSchedule(id, { boardMemberIds });
}

export function resetDefenseSchedules() {
  defenseSchedules = [
    {
      id: 1,
      thesisId: 1,
      room: 'A-204',
      date: '2026-09-10',
      time: '10:00',
      boardMemberIds: [2],
      status: 'scheduled',
      notes: 'Please bring presentation slides.'
    }
  ];
}
