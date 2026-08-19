import {
  getAllDefenseSchedules,
  getDefenseScheduleById,
  createDefenseSchedule,
  updateDefenseSchedule,
  assignBoardMembers
} from '../models/defenseModel.js';
import { triggerNotification } from '../models/notificationModel.js';

export function listDefenseSchedules(req, res) {
  const schedules = getAllDefenseSchedules();
  return res.json({ items: schedules });
}

export function getDefenseSchedule(req, res) {
  const { id } = req.params;
  const schedule = getDefenseScheduleById(id);

  if (!schedule) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({ schedule });
}

export function scheduleDefense(req, res) {
  const { thesisId, room, date, time, boardMemberIds, notes } = req.body;

  if (!thesisId || !room || !date || !time) {
    return res.status(400).json({ message: 'thesisId, room, date, and time are required' });
  }

  const schedule = createDefenseSchedule({
    thesisId,
    room,
    date,
    time,
    boardMemberIds,
    notes
  });

  // Trigger notification for student and board members
  triggerNotification({
    userId: 1, // Student ID
    message: `Defense scheduled for thesis #${thesisId} on ${date} at ${time} (Room: ${room})`,
    type: 'defense_scheduled'
  });

  return res.status(201).json({
    message: 'Defense schedule saved',
    schedule
  });
}

export function editDefenseSchedule(req, res) {
  const { id } = req.params;
  const updated = updateDefenseSchedule(id, req.body);

  if (!updated) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({
    message: 'Defense schedule updated',
    schedule: updated
  });
}

export function assignBoardMembersToDefense(req, res) {
  const { id } = req.params;
  const { boardMemberIds } = req.body;

  if (!Array.isArray(boardMemberIds)) {
    return res.status(400).json({ message: 'boardMemberIds must be an array' });
  }

  const updated = assignBoardMembers(id, boardMemberIds);

  if (!updated) {
    return res.status(404).json({ message: 'Defense schedule not found' });
  }

  return res.json({
    message: 'Board members assigned successfully',
    schedule: updated
  });
}
